import type { TrackId } from './lesson.model'

/** One step of an if/elif/else flowchart. */
export type FlowNode =
  | {
      kind: 'decision'
      condition: string
      /** What the condition evaluates to; needed only for decisions on the path actually taken. */
      result?: boolean
      yes: FlowNode
      no: FlowNode
    }
  /** A statement that runs, e.g. print("A"). Labels must be unique within one chart. */
  | { kind: 'action'; label: string }
  /** No else: nothing runs on this branch. */
  | { kind: 'skip' }

export interface FlowPuzzle {
  /** Variable assignments shown above the chart. */
  setup: string
  tree: FlowNode
}

export interface GameQuestion {
  /** Text prompt above the code. */
  prompt: string
  /** Python code or a literal shown in a code panel. */
  code?: string
  options: string[]
  /** Index of the correct option. */
  answer: number
  explanation: string
  /** Flowchart questions: the player clicks the block that runs instead of picking an option. */
  flow?: FlowPuzzle
}

export interface GameDefinition {
  id: string
  title: string
  tagline: string
  /** mdi icon name rendered by GameIcon, e.g. "magnify". */
  icon:
    | 'magnify'
    | 'crystal-ball'
    | 'bug'
    | 'table'
    | 'chart-bar'
    | 'sigma'
    | 'link-variant'
    | 'broom'
    | 'briefcase-search-outline'
    | 'calculator'
    | 'scale-balance'
    | 'source-branch'
    | 'sitemap'
  color: string
  /** Lesson the game practises (its order inside the track). */
  day: number
  track: TrackId
  secondsPerQuestion: number
  questionsPerRound: number
  bank: GameQuestion[]
}

export interface AnswerRecord {
  questionIndex: number
  chosen: number | null
  correct: boolean
  points: number
}
