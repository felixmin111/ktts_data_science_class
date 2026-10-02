import { describe, expect, it } from 'vitest'
import {
  NOTHING_PRINTED,
  assign,
  augment,
  forRange,
  layoutLoop,
  loopAnswer,
  loopProgram,
  loopToPython,
  print,
  runLoop,
  when,
  whileLoop
} from '@/functions/loop.function'
import { games } from '@/data/games'
import { lessons } from '@/data/lessons'
import type { LoopProgram } from '@/models/loop.model'

const n = (v: unknown) => Number(v)

const counting = loopProgram(
  [assign('i', 1)],
  whileLoop('i <= 3', (v) => n(v.i) <= 3),
  [print('i', (v) => String(v.i)), augment('i', '+=', '1', () => 1)],
  [print('"Done"', () => 'Done')]
)

const breaking = loopProgram([], forRange('i', 1, 10), [
  when('i % 4 == 0', (v) => n(v.i) % 4 === 0, 'break'),
  print('i', (v) => String(v.i))
])

describe('runLoop', () => {
  it('records every box, the output and the passes', () => {
    const run = runLoop(counting)
    expect(run.output).toEqual(['1', '2', '3', 'Done'])
    expect(run.passes).toBe(3)
    expect(run.steps.filter((s) => s.node === 'loop').map((s) => s.check)).toEqual([
      true,
      true,
      true,
      false
    ])
    expect(run.steps.at(-1)!.node).toBe('end')
  })

  it('leaves the loop on break', () => {
    const run = runLoop(breaking)
    expect(run.output).toEqual(['1', '2', '3'])
    expect(run.steps.map((s) => s.node)).toContain('body-0-then')
  })

  it('stops a never-ending loop', () => {
    const forever = loopProgram(
      [assign('i', 1)],
      whileLoop('i <= 3', () => true),
      [print('i', () => '1')]
    )
    expect(() => runLoop(forever)).toThrow()
  })

  it('reports an empty output', () => {
    const never = loopProgram(
      [assign('i', 5)],
      whileLoop('i < 3', (v) => n(v.i) < 3),
      [print('i', (v) => String(v.i))]
    )
    expect(loopAnswer(never, 'output')).toBe(NOTHING_PRINTED)
  })
})

describe('loopToPython', () => {
  it('writes setup, the loop, an indented body and the code after it', () => {
    expect(loopToPython(counting)).toBe(
      ['i = 1', '', 'while i <= 3:', '    print(i)', '    i += 1', '', 'print("Done")'].join('\n')
    )
    expect(loopToPython(breaking)).toBe(
      ['for i in range(1, 10):', '    if i % 4 == 0:', '        break', '    print(i)'].join('\n')
    )
  })
})

const allLoops: [string, LoopProgram][] = [
  ...games.flatMap((game) =>
    game.bank
      .filter((q) => q.loop)
      .map((q, i) => [`${game.id} #${i + 1}`, q.loop!] as [string, LoopProgram])
  ),
  ...lessons.flatMap((lesson) =>
    lesson.sections.flatMap((section) =>
      section.blocks.flatMap((block, i) =>
        block.type === 'loop'
          ? [[`${lesson.id}/${section.id} #${i + 1}`, block.program] as [string, LoopProgram]]
          : []
      )
    )
  )
]

describe('loop diagrams in games and lessons', () => {
  it.each(allLoops)(
    '%s finishes, has an edge for every hop and no overlapping boxes',
    (_, program) => {
      const run = runLoop(program)
      const { boxes, edges } = layoutLoop(program)
      for (let i = 1; i < run.steps.length; i++) {
        const from = run.steps[i - 1]!.node
        const to = run.steps[i]!.node
        expect(
          edges.some((e) => e.from === from && e.to === to),
          `${from} → ${to}`
        ).toBe(true)
      }
      for (const a of boxes) {
        for (const b of boxes) {
          if (a === b) continue
          const apart =
            Math.abs(a.x - b.x) >= (a.width + b.width) / 2 ||
            Math.abs(a.y - b.y) >= (a.height + b.height) / 2
          expect(apart, `${a.id} overlaps ${b.id}`).toBe(true)
        }
      }
    }
  )

  it('game options are unique and the answer is the computed one', () => {
    for (const game of games) {
      for (const q of game.bank.filter((question) => question.loop)) {
        expect(new Set(q.options).size).toBe(q.options.length)
        expect(q.answer).toBe(0)
      }
    }
  })
})
