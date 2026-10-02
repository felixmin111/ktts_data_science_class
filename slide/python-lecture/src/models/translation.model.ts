import type {
  AnalogyBlock,
  CalloutBlock,
  CaseStudyBlock,
  CodeBlock,
  FlowBlock,
  LessonSection,
  MemoryBlock,
  QuizBlock,
  TableBlock,
  TextBlock,
  Track,
  TrackId
} from './lesson.model'
import type { GameDefinition, GameQuestion } from './game.model'

/**
 * Translations are overlays: they hold only the human-readable text and are merged onto the English
 * lesson / game by position. Python code, answers, ids and settings always come from the English
 * source, so they live in one place. `type` / `id` are repeated so a spec can check the overlay
 * still lines up with its source.
 */
export type BlockTranslation =
  | MemoryBlock
  | Pick<TextBlock, 'type' | 'body'>
  | (Pick<CodeBlock, 'type'> & Partial<Pick<CodeBlock, 'title'>>)
  | Pick<AnalogyBlock, 'type' | 'title' | 'body'>
  | (Pick<TableBlock, 'type' | 'columns'> & Partial<Pick<TableBlock, 'rows'>>)
  | Pick<CalloutBlock, 'type' | 'title' | 'body'>
  | Pick<CaseStudyBlock, 'type' | 'domain' | 'title' | 'problem' | 'data' | 'method' | 'outcome'>
  | (Pick<QuizBlock, 'type' | 'question' | 'explanation'> & Partial<Pick<QuizBlock, 'options'>>)
  | (Pick<FlowBlock, 'type' | 'explanation'> & Partial<Pick<FlowBlock, 'title'>>)

export interface SectionTranslation extends Pick<
  LessonSection,
  'id' | 'eyebrow' | 'title' | 'notes'
> {
  blocks: BlockTranslation[]
}

export interface LessonTranslation {
  title: string
  summary: string
  topics?: string[]
  sections?: SectionTranslation[]
}

export type QuestionTranslation = Partial<Pick<GameQuestion, 'prompt' | 'options'>> &
  Pick<GameQuestion, 'explanation'>

export interface GameTranslation extends Pick<GameDefinition, 'title' | 'tagline'> {
  bank: QuestionTranslation[]
}

export type TrackTranslation = Pick<Track, 'title' | 'description' | 'labelPrefix'>

/** Everything one language translates, keyed by lesson / game / track id. */
export interface ContentTranslation {
  tracks: Record<TrackId, TrackTranslation>
  lessons: Record<string, LessonTranslation>
  games: Record<string, GameTranslation>
}
