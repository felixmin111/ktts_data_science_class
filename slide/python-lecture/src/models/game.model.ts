import type { TrackId } from './lesson.model'

export interface GameQuestion {
  /** Text prompt above the code. */
  prompt: string
  /** Python code or a literal shown in a code panel. */
  code?: string
  options: string[]
  /** Index of the correct option. */
  answer: number
  explanation: string
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
