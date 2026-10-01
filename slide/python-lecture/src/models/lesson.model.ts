export interface TextBlock {
  type: 'text'
  /** Paragraphs. Inline `code` in backticks and **bold** are supported. */
  body: string[]
}

export interface CodeBlock {
  type: 'code'
  code: string
  /** Expected output shown before the learner runs it. */
  output?: string
  /** Lines fed to input(), one per line. */
  stdin?: string[]
  /** Show the "Run" button (executes with Pyodide). */
  runnable?: boolean
  title?: string
}

export interface AnalogyBlock {
  type: 'analogy'
  title: string
  body: string
}

export interface TableBlock {
  type: 'table'
  columns: string[]
  rows: string[][]
  /** Column indexes rendered in monospace as code. */
  codeColumns?: number[]
}

export interface CalloutBlock {
  type: 'callout'
  tone: 'info' | 'warning' | 'success'
  title: string
  body: string
}

/** A real-world example: the problem, the data, the method and what it achieves. */
export interface CaseStudyBlock {
  type: 'case'
  /** Who has this problem, e.g. "Banks" or "Streaming services". */
  domain: string
  title: string
  problem: string
  data: string
  method: string
  outcome: string
}

export interface QuizBlock {
  type: 'quiz'
  question: string
  code?: string
  options: string[]
  answer: number
  explanation: string
}

export type LessonBlock =
  | TextBlock
  | CodeBlock
  | AnalogyBlock
  | TableBlock
  | CalloutBlock
  | CaseStudyBlock
  | QuizBlock

export interface LessonSection {
  id: string
  eyebrow: string
  title: string
  /** Suggested minutes for this stage of the class. */
  minutes?: number
  blocks: LessonBlock[]
  /** Teacher-only notes, shown when "Teacher mode" is on. */
  notes?: string
}

export type TrackId = 'foundations' | 'data-science'

export interface Track {
  id: TrackId
  title: string
  description: string
  /** Short label shown before each lesson number, e.g. "Day" or "DS". */
  labelPrefix: string
}

export interface Lesson {
  id: string
  track: TrackId
  /** Order inside its track (1-based). */
  day: number
  title: string
  summary: string
  durationMinutes: number
  topics: string[]
  sections: LessonSection[]
  available: boolean
}
