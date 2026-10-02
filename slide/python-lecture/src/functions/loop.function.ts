import type {
  LoopBodyItem,
  LoopHeader,
  LoopIf,
  LoopProgram,
  LoopStatement,
  LoopVars
} from '@/models/loop.model'
import type { GameQuestion } from '@/models/game.model'

// ---- Builders ---------------------------------------------------------------------------------

export function stmt(code: string, run: LoopStatement['run']): LoopStatement {
  return { kind: 'stmt', code, run }
}

/** `name = value` */
export function assign(name: string, value: number | string | boolean): LoopStatement {
  return stmt(`${name} = ${pyLiteral(value)}`, (vars) => {
    vars[name] = value
  })
}

/** `name += step` (also works for -=, *=) */
export function augment(
  name: string,
  op: '+=' | '-=' | '*=',
  by: string,
  amount: (v: LoopVars) => number
): LoopStatement {
  return stmt(`${name} ${op} ${by}`, (vars) => {
    const current = Number(vars[name])
    const value = amount(vars)
    vars[name] = op === '+=' ? current + value : op === '-=' ? current - value : current * value
  })
}

/** `print(expr)` where `show` returns the printed text. */
export function print(expr: string, show: (vars: LoopVars) => string): LoopStatement {
  return stmt(`print(${expr})`, (vars, output) => {
    output.push(show(vars))
  })
}

export function whileLoop(condition: string, test: (vars: LoopVars) => boolean): LoopHeader {
  return { kind: 'while', condition, test }
}

export function forRange(variable: string, ...args: number[]): LoopHeader {
  const [start, stop, step] =
    args.length === 1 ? [0, args[0]!, 1] : [args[0]!, args[1]!, args[2] ?? 1]
  const items: number[] = []
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) items.push(i)
  return {
    kind: 'for',
    code: `for ${variable} in range(${args.join(', ')})`,
    variable,
    items: () => items
  }
}

export function forEach(
  variable: string,
  iterable: string,
  values: (number | string)[]
): LoopHeader {
  return { kind: 'for', code: `for ${variable} in ${iterable}`, variable, items: () => values }
}

export function when(
  condition: string,
  test: (vars: LoopVars) => boolean,
  then: LoopIf['then']
): LoopIf {
  return { kind: 'if', condition, test, then }
}

export function loopProgram(
  setup: LoopStatement[],
  loop: LoopHeader,
  body: LoopBodyItem[],
  after: LoopStatement[] = []
): LoopProgram {
  return { setup, loop, body, after }
}

export function pyLiteral(value: number | string | boolean): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'boolean') return value ? 'True' : 'False'
  return String(value)
}

// ---- Running ----------------------------------------------------------------------------------

/** One box the program passes through, with the state right after it. */
export interface LoopStep {
  node: string
  vars: LoopVars
  output: string[]
  /** Result of a check (the loop condition or an if). */
  check?: boolean
  /** Which pass of the loop this step belongs to (0 before the loop starts). */
  pass: number
}

export interface LoopRun {
  steps: LoopStep[]
  output: string[]
  vars: LoopVars
  /** How many times the body started. */
  passes: number
}

const MAX_STEPS = 400

/** Runs the program in JavaScript and records every box it passes through. */
export function runLoop(program: LoopProgram): LoopRun {
  const vars: LoopVars = {}
  const output: string[] = []
  const steps: LoopStep[] = []
  let pass = 0
  const record = (node: string, check?: boolean) => {
    if (steps.length > MAX_STEPS) throw new Error('Loop runs too long (infinite loop?)')
    steps.push({
      node,
      vars: { ...vars },
      output: [...output],
      pass,
      ...(check !== undefined && { check })
    })
  }

  record('start')
  program.setup.forEach((s, i) => {
    s.run(vars, output)
    record(`setup-${i}`)
  })

  const items = program.loop.kind === 'for' ? program.loop.items(vars) : []
  let index = 0
  loop: while (true) {
    let ok: boolean
    if (program.loop.kind === 'while') {
      ok = program.loop.test(vars)
    } else {
      ok = index < items.length
      if (ok) vars[program.loop.variable] = items[index++]!
    }
    record('loop', ok)
    if (!ok) break
    pass += 1
    for (let i = 0; i < program.body.length; i++) {
      const item = program.body[i]!
      if (item.kind === 'stmt') {
        item.run(vars, output)
        record(`body-${i}`)
        continue
      }
      const hit = item.test(vars)
      record(`body-${i}`, hit)
      if (!hit) continue
      if (item.then === 'break') {
        record(`body-${i}-then`)
        break loop
      }
      if (item.then === 'continue') {
        record(`body-${i}-then`)
        continue loop
      }
      item.then.run(vars, output)
      record(`body-${i}-then`)
    }
  }

  program.after.forEach((s, i) => {
    s.run(vars, output)
    record(`after-${i}`)
  })
  record('end')
  return { steps, output, vars: { ...vars }, passes: pass }
}

/** The program as Python source. */
export function loopToPython(program: LoopProgram): string {
  const lines = program.setup.map((s) => s.code)
  if (lines.length) lines.push('')
  lines.push(
    program.loop.kind === 'while' ? `while ${program.loop.condition}:` : `${program.loop.code}:`
  )
  for (const item of program.body) {
    if (item.kind === 'stmt') {
      lines.push(`    ${item.code}`)
      continue
    }
    lines.push(`    if ${item.condition}:`)
    lines.push(`        ${typeof item.then === 'string' ? item.then : item.then.code}`)
  }
  if (program.after.length) lines.push('', ...program.after.map((s) => s.code))
  return lines.join('\n')
}

/** Setup lines shown above the chart (the starting values). */
export function loopSetup(program: LoopProgram): string {
  return program.setup.map((s) => s.code).join('\n')
}

export type LoopAsk = 'output' | 'passes' | { variable: string }

/** The correct answer text for a question about this program. */
export function loopAnswer(program: LoopProgram, ask: LoopAsk): string {
  const run = runLoop(program)
  if (ask === 'output') return run.output.length ? run.output.join('\n') : NOTHING_PRINTED
  if (ask === 'passes') return String(run.passes)
  return pyLiteral(run.vars[ask.variable]!)
}

export const NOTHING_PRINTED = '(nothing printed)'

const PROMPTS: Record<'output' | 'passes' | 'variable', string> = {
  output: 'What does this loop print?',
  passes: 'How many times does the loop body run?',
  variable: 'What is the value of {name} after the loop?'
}

/** A game question: the correct answer is computed by running the program, so it cannot be wrong. */
export function loopQuestion(
  program: LoopProgram,
  ask: LoopAsk,
  wrong: string[],
  explanation: string
): GameQuestion {
  const correct = loopAnswer(program, ask)
  const prompt =
    typeof ask === 'string' ? PROMPTS[ask] : PROMPTS.variable.replace('{name}', ask.variable)
  return {
    prompt,
    code: loopToPython(program),
    options: [correct, ...wrong],
    answer: 0,
    explanation,
    loop: program
  }
}

// ---- Layout -----------------------------------------------------------------------------------

export type LoopPoint = [number, number]

export interface LoopBox {
  id: string
  kind: 'start' | 'end' | 'stmt' | 'check' | 'jump'
  text: string
  x: number
  y: number
  width: number
  height: number
}

export interface LoopEdge {
  from: string
  to: string
  label?: 'True' | 'False'
  points: LoopPoint[]
  labelAt?: LoopPoint
}

export interface LoopLayout {
  boxes: LoopBox[]
  edges: LoopEdge[]
  width: number
  height: number
}

const ROW = 76
const BOX_H = 40
const CHAR_W = 8.4
const PAD = 24
const LANE = 34

function width(text: string, kind: LoopBox['kind']) {
  return Math.max(kind === 'jump' ? 84 : 100, text.length * CHAR_W + (kind === 'check' ? 52 : 30))
}

function headerText(loop: LoopHeader) {
  return loop.kind === 'while' ? `while ${loop.condition}` : loop.code
}

/**
 * A top-down spine: setup, the loop check, the body, then the code after the loop. The loop-back
 * arrow runs up a lane on the left; the exit arrow runs down a lane on the right. An if inside the
 * body puts its True branch (a statement, break or continue) to the right of the spine.
 */
export function layoutLoop(program: LoopProgram): LoopLayout {
  const spine: { id: string; kind: LoopBox['kind']; text: string }[] = [
    { id: 'start', kind: 'start', text: 'Start' },
    ...program.setup.map((s, i) => ({ id: `setup-${i}`, kind: 'stmt' as const, text: s.code })),
    { id: 'loop', kind: 'check', text: headerText(program.loop) },
    ...program.body.map((b, i) => ({
      id: `body-${i}`,
      kind: (b.kind === 'stmt' ? 'stmt' : 'check') as LoopBox['kind'],
      text: b.kind === 'stmt' ? b.code : `if ${b.condition}`
    }))
  ]
  const after = [
    ...program.after.map((s, i) => ({ id: `after-${i}`, kind: 'stmt' as const, text: s.code })),
    { id: 'end', kind: 'end' as const, text: 'End' }
  ]

  const spineWidth = Math.max(...[...spine, ...after].map((b) => width(b.text, b.kind)))
  const left = PAD + LANE
  const cx = left + spineWidth / 2 + 12

  const boxes: LoopBox[] = []
  let y = PAD + BOX_H / 2
  for (const item of spine) {
    boxes.push({ ...item, x: cx, y, width: width(item.text, item.kind), height: BOX_H })
    y += ROW
  }
  // Then-branches sit to the right of their if.
  let thenRight = cx + spineWidth / 2
  program.body.forEach((b, i) => {
    if (b.kind !== 'if') return
    const parent = boxes.find((box) => box.id === `body-${i}`)!
    const text = typeof b.then === 'string' ? b.then : b.then.code
    const kind: LoopBox['kind'] = typeof b.then === 'string' ? 'jump' : 'stmt'
    const w = width(text, kind)
    const x = cx + spineWidth / 2 + 48 + w / 2
    boxes.push({ id: `body-${i}-then`, kind, text, x, y: parent.y, width: w, height: BOX_H })
    thenRight = Math.max(thenRight, x + w / 2)
  })

  const lastBody = boxes.filter((b) => b.id.startsWith('body-') && !b.id.endsWith('-then')).at(-1)!
  const backY = lastBody.y + BOX_H / 2 + 22
  y = backY + 22 + BOX_H / 2 + 18
  for (const item of after) {
    boxes.push({ ...item, x: cx, y, width: width(item.text, item.kind), height: BOX_H })
    y += ROW
  }
  const right = thenRight + LANE
  const byId = new Map(boxes.map((b) => [b.id, b]))
  const box = (id: string) => byId.get(id)!
  const top = (b: LoopBox): LoopPoint => [b.x, b.y - b.height / 2]
  const bottom = (b: LoopBox): LoopPoint => [b.x, b.y + b.height / 2]
  const loopBox = box('loop')
  const exitBox = box(after[0]!.id)
  const exitY = exitBox.y - BOX_H / 2 - 14

  const toLoop = (from: LoopBox): LoopPoint[] => [
    bottom(from),
    [from.x, backY],
    [left - LANE / 2, backY],
    [left - LANE / 2, loopBox.y],
    [loopBox.x - loopBox.width / 2, loopBox.y]
  ]
  const toExit = (start: LoopPoint): LoopPoint[] => [
    start,
    [right - LANE / 2, start[1]],
    [right - LANE / 2, exitY],
    [exitBox.x, exitY],
    top(exitBox)
  ]
  const down = (from: LoopBox, to: LoopBox): LoopPoint[] =>
    from.x === to.x
      ? [bottom(from), top(to)]
      : [bottom(from), [from.x, to.y - BOX_H / 2 - 14], [to.x, to.y - BOX_H / 2 - 14], top(to)]

  const edges: LoopEdge[] = []
  const spineIds = spine.map((s) => s.id)
  for (let i = 0; i < spineIds.indexOf('loop'); i++) {
    edges.push({
      from: spineIds[i]!,
      to: spineIds[i + 1]!,
      points: down(box(spineIds[i]!), box(spineIds[i + 1]!))
    })
  }
  // Loop check: True into the body (or straight back when the body is empty), False to the exit.
  const firstBody = program.body.length ? box('body-0') : null
  edges.push({
    from: 'loop',
    to: firstBody ? 'body-0' : 'loop',
    label: 'True',
    points: firstBody ? down(loopBox, firstBody) : toLoop(loopBox),
    labelAt: [loopBox.x + 22, loopBox.y + BOX_H / 2 + 14]
  })
  const loopRight: LoopPoint = [loopBox.x + loopBox.width / 2, loopBox.y]
  edges.push({
    from: 'loop',
    to: exitBox.id,
    label: 'False',
    points: toExit(loopRight),
    labelAt: [loopRight[0] + 24, loopBox.y - 8]
  })

  const nextOf = (i: number) => (i + 1 < program.body.length ? box(`body-${i + 1}`) : null)
  program.body.forEach((b, i) => {
    const self = box(`body-${i}`)
    const next = nextOf(i)
    const onward = (from: LoopBox): LoopEdge => ({
      from: from.id,
      to: next ? next.id : 'loop',
      points: next ? down(from, next) : toLoop(from)
    })
    if (b.kind === 'stmt') {
      edges.push(onward(self))
      return
    }
    const thenBox = box(`body-${i}-then`)
    const selfRight: LoopPoint = [self.x + self.width / 2, self.y]
    edges.push({
      from: self.id,
      to: thenBox.id,
      label: 'True',
      points: [selfRight, [thenBox.x - thenBox.width / 2, thenBox.y]],
      labelAt: [selfRight[0] + 22, self.y - 8]
    })
    edges.push({ ...onward(self), label: 'False', labelAt: [self.x + 24, self.y + BOX_H / 2 + 14] })
    if (b.then === 'break') {
      edges.push({
        from: thenBox.id,
        to: exitBox.id,
        points: toExit([thenBox.x + thenBox.width / 2, thenBox.y])
      })
    } else if (b.then === 'continue') {
      edges.push({
        from: thenBox.id,
        to: 'loop',
        points: [
          bottom(thenBox),
          [thenBox.x, backY],
          [left - LANE / 2, backY],
          [left - LANE / 2, loopBox.y],
          [loopBox.x - loopBox.width / 2, loopBox.y]
        ]
      })
    } else {
      edges.push(onward(thenBox))
    }
  })

  for (let i = 0; i < after.length - 1; i++) {
    edges.push({
      from: after[i]!.id,
      to: after[i + 1]!.id,
      points: down(box(after[i]!.id), box(after[i + 1]!.id))
    })
  }

  const maxX = Math.max(right, ...boxes.map((b) => b.x + b.width / 2)) + PAD
  const maxY = Math.max(...boxes.map((b) => b.y + b.height / 2)) + PAD
  return { boxes, edges, width: maxX, height: maxY }
}
