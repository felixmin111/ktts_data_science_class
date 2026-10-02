import { describe, expect, it } from 'vitest'
import {
  SKIP_LABEL,
  action,
  decision,
  flowLeaves,
  flowPath,
  flowQuestion,
  flowToPython,
  layoutFlow,
  skip
} from '@/functions/flow.function'
import { games } from '@/data/games'
import { lessons } from '@/data/lessons'
import type { FlowNode } from '@/models/game.model'

const ladder = decision(
  'score >= 80',
  false,
  action('print("A")'),
  decision('score >= 60', true, action('print("B")'), action('print("C")'))
)

const nested = decision(
  'age >= 18',
  true,
  decision('has_id', false, action('print("enter")'), action('print("show ID")')),
  skip
)

describe('flowToPython', () => {
  it('writes a False branch that is another decision as elif', () => {
    expect(flowToPython({ setup: 'score = 72', tree: ladder })).toBe(
      [
        'score = 72',
        '',
        'if score >= 80:',
        '    print("A")',
        'elif score >= 60:',
        '    print("B")',
        'else:',
        '    print("C")'
      ].join('\n')
    )
  })

  it('indents a True branch that is another decision and drops an empty else', () => {
    expect(flowToPython({ setup: 'age = 20', tree: nested })).toBe(
      [
        'age = 20',
        '',
        'if age >= 18:',
        '    if has_id:',
        '        print("enter")',
        '    else:',
        '        print("show ID")'
      ].join('\n')
    )
  })
})

describe('flowPath and flowQuestion', () => {
  it('follows each decision result to the block that runs', () => {
    expect(flowPath(ladder)).toEqual(['r', 'r.n', 'r.n.y'])
    expect(flowPath(nested)).toEqual(['r', 'r.y', 'r.y.n'])
  })

  it('throws when a decision on the path has no result', () => {
    expect(() => flowPath(decision('x', null, action('a'), action('b')))).toThrow()
  })

  it('makes the end blocks the options and the reached block the answer', () => {
    const question = flowQuestion('age = 20', nested, '')
    expect(question.options).toEqual(['print("enter")', 'print("show ID")', SKIP_LABEL])
    expect(question.options[question.answer]).toBe('print("show ID")')
  })
})

describe('layoutFlow', () => {
  it('never lets two boxes overlap', () => {
    const { boxes } = layoutFlow(ladder)
    for (const a of boxes) {
      for (const b of boxes) {
        if (a === b) continue
        const apart =
          Math.abs(a.x - b.x) >= (a.width + b.width) / 2 ||
          Math.abs(a.y - b.y) >= (a.height + b.height) / 2
        expect(apart, `${a.id} overlaps ${b.id}`).toBe(true)
      }
    }
  })
})

describe('flowcharts in games and lessons', () => {
  const charts: [string, FlowNode][] = [
    ...games.flatMap((game) =>
      game.bank
        .filter((q) => q.flow)
        .map((q) => [`${game.id}: ${q.flow!.setup}`, q.flow!.tree] as [string, FlowNode])
    ),
    ...lessons.flatMap((lesson) =>
      lesson.sections.flatMap((section) =>
        section.blocks.flatMap((block) =>
          block.type === 'flow'
            ? [[`${lesson.id}/${section.id}: ${block.setup}`, block.tree] as [string, FlowNode]]
            : []
        )
      )
    )
  ]

  it.each(charts)('%s has unique blocks, a full path and no overlapping boxes', (_, tree) => {
    const labels = flowLeaves(tree).map((leaf) => leaf.label)
    expect(new Set(labels).size).toBe(labels.length)
    expect(() => flowPath(tree)).not.toThrow()
    const { boxes } = layoutFlow(tree)
    for (const a of boxes) {
      for (const b of boxes) {
        if (a === b) continue
        const apart =
          Math.abs(a.x - b.x) >= (a.width + b.width) / 2 ||
          Math.abs(a.y - b.y) >= (a.height + b.height) / 2
        expect(apart, `${a.id} overlaps ${b.id}`).toBe(true)
      }
    }
  })
})
