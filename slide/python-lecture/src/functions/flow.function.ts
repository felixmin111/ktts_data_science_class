import type { FlowNode, FlowPuzzle, GameQuestion } from '@/models/game.model'

/** Option text for a branch where nothing runs; shown translated in the UI. */
export const SKIP_LABEL = '(nothing runs)'

export type FlowPoint = [number, number]

export interface FlowBox {
  /** "start", "r" for the root, then ".y"/".n" per branch, e.g. "r.n.y". */
  id: string
  kind: 'start' | FlowNode['kind']
  text: string
  x: number
  y: number
  width: number
  height: number
}

export interface FlowEdge {
  from: string
  to: string
  branch: 'start' | 'yes' | 'no'
  points: FlowPoint[]
}

export interface FlowLayout {
  boxes: FlowBox[]
  edges: FlowEdge[]
  width: number
  height: number
}

const ROW = 112
const BOX_HEIGHT = 46
const PADDING = 20
const CHAR_WIDTH = 8.6
const MIN_WIDTH = 96

export function decision(
  condition: string,
  result: boolean | null,
  yes: FlowNode,
  no: FlowNode
): FlowNode {
  return { kind: 'decision', condition, ...(result !== null && { result }), yes, no }
}

export function action(label: string): FlowNode {
  return { kind: 'action', label }
}

export const skip: FlowNode = { kind: 'skip' }

function labelOf(node: FlowNode): string {
  if (node.kind === 'decision') return node.condition
  return node.kind === 'action' ? node.label : SKIP_LABEL
}

/** The end blocks of the chart, left to right (True branches first). */
export function flowLeaves(tree: FlowNode, id = 'r'): { id: string; label: string }[] {
  if (tree.kind === 'decision') {
    return [...flowLeaves(tree.yes, `${id}.y`), ...flowLeaves(tree.no, `${id}.n`)]
  }
  return [{ id, label: labelOf(tree) }]
}

/** Box ids visited from the root to the block that runs, following each decision's result. */
export function flowPath(tree: FlowNode): string[] {
  const path: string[] = []
  let node = tree
  let id = 'r'
  while (node.kind === 'decision') {
    path.push(id)
    if (node.result === undefined) {
      throw new Error(`Decision "${node.condition}" is on the path but has no result`)
    }
    id = `${id}.${node.result ? 'y' : 'n'}`
    node = node.result ? node.yes : node.no
  }
  path.push(id)
  return path
}

/** Decision results along the path, keyed by box id. */
export function flowResults(tree: FlowNode): Record<string, boolean> {
  const results: Record<string, boolean> = {}
  let node = tree
  let id = 'r'
  while (node.kind === 'decision' && node.result !== undefined) {
    results[id] = node.result
    id = `${id}.${node.result ? 'y' : 'n'}`
    node = node.result ? node.yes : node.no
  }
  return results
}

function pythonLines(node: FlowNode, indent: string, keyword: 'if' | 'elif'): string[] {
  if (node.kind !== 'decision') return []
  const inner = `${indent}    `
  const lines = [`${indent}${keyword} ${node.condition}:`, ...pythonBody(node.yes, inner)]
  if (node.no.kind === 'decision') lines.push(...pythonLines(node.no, indent, 'elif'))
  else if (node.no.kind === 'action') lines.push(`${indent}else:`, `${inner}${node.no.label}`)
  return lines
}

function pythonBody(node: FlowNode, indent: string): string[] {
  if (node.kind === 'decision') return pythonLines(node, indent, 'if')
  return [`${indent}${node.kind === 'action' ? node.label : 'pass'}`]
}

/** The chart written as Python: a False branch that is another decision becomes elif. */
export function flowToPython({ setup, tree }: FlowPuzzle): string {
  return [setup, '', ...pythonLines(tree, '', 'if')].join('\n')
}

/** A game question whose options are the chart's end blocks and whose answer is the one reached. */
export function flowQuestion(
  setup: string,
  tree: FlowNode,
  explanation: string,
  prompt = 'Click the block that runs.'
): GameQuestion {
  const leaves = flowLeaves(tree)
  const reached = flowPath(tree).at(-1)
  return {
    prompt,
    code: flowToPython({ setup, tree }),
    options: leaves.map((leaf) => leaf.label),
    answer: leaves.findIndex((leaf) => leaf.id === reached),
    explanation,
    flow: { setup, tree }
  }
}

function boxWidth(text: string, kind: FlowBox['kind']): number {
  // Decisions are drawn as hexagons, so they need room for the pointed ends.
  return Math.max(MIN_WIDTH, text.length * CHAR_WIDTH + (kind === 'decision' ? 56 : 32))
}

/**
 * Lays the chart out top-down: every end block gets its own column, a decision sits halfway
 * between its True (left) and False (right) branches, and each level of nesting is one row lower.
 * An if/elif ladder therefore comes out as a staircase.
 */
export function layoutFlow(tree: FlowNode): FlowLayout {
  const raw: { id: string; node: FlowNode; depth: number }[] = []
  const walk = (node: FlowNode, id: string, depth: number) => {
    raw.push({ id, node, depth })
    if (node.kind === 'decision') {
      walk(node.yes, `${id}.y`, depth + 1)
      walk(node.no, `${id}.n`, depth + 1)
    }
  }
  walk(tree, 'r', 1)

  const widths = raw.map(({ node }) => boxWidth(labelOf(node), node.kind))
  const column = Math.max(...widths) + 28
  const leafIds = flowLeaves(tree).map((leaf) => leaf.id)

  const xOf = new Map<string, number>()
  const place = (node: FlowNode, id: string): number => {
    const x =
      node.kind === 'decision'
        ? (place(node.yes, `${id}.y`) + place(node.no, `${id}.n`)) / 2
        : PADDING + column * (leafIds.indexOf(id) + 0.5)
    xOf.set(id, x)
    return x
  }
  const rootX = place(tree, 'r')
  const yOf = (depth: number) => PADDING + BOX_HEIGHT / 2 + depth * ROW

  const boxes: FlowBox[] = [
    {
      id: 'start',
      kind: 'start',
      text: 'Start',
      x: rootX,
      y: yOf(0),
      width: MIN_WIDTH,
      height: BOX_HEIGHT
    },
    ...raw.map(({ id, node, depth }, index) => ({
      id,
      kind: node.kind,
      text: labelOf(node),
      x: xOf.get(id)!,
      y: yOf(depth),
      width: widths[index]!,
      height: BOX_HEIGHT
    }))
  ]

  const byId = new Map(boxes.map((box) => [box.id, box]))
  const root = byId.get('r')!
  const edges: FlowEdge[] = [
    {
      from: 'start',
      to: 'r',
      branch: 'start',
      points: [
        [rootX, yOf(0) + BOX_HEIGHT / 2],
        [rootX, root.y - BOX_HEIGHT / 2]
      ]
    }
  ]
  for (const { id, node } of raw) {
    if (node.kind !== 'decision') continue
    const parent = byId.get(id)!
    for (const branch of ['yes', 'no'] as const) {
      const child = byId.get(`${id}.${branch === 'yes' ? 'y' : 'n'}`)!
      const side = branch === 'yes' ? -1 : 1
      edges.push({
        from: id,
        to: child.id,
        branch,
        points: [
          [parent.x + (side * parent.width) / 2, parent.y],
          [child.x, parent.y],
          [child.x, child.y - BOX_HEIGHT / 2]
        ]
      })
    }
  }

  const right = Math.max(...boxes.map((box) => box.x + box.width / 2))
  const bottom = Math.max(...boxes.map((box) => box.y + box.height / 2))
  return { boxes, edges, width: right + PADDING, height: bottom + PADDING }
}
