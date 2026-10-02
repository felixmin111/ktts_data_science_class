import type { User } from './auth.model'

export interface SectionVisit {
  lessonId: string
  sectionId: string
  visitCount: number
  firstVisitedAt: string
  lastVisitedAt: string
}

export interface GameResultRequest {
  gameId: string
  score: number
  correct: number
  total: number
  bestStreak: number
}

export interface GameResult extends GameResultRequest {
  id: string
  playedAt: string
}

export interface RecordedGame {
  result: GameResult
  newBest: boolean
}

export interface Page<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
}

export interface StudentSummary {
  id: string
  email: string
  displayName: string
  createdAt: string
  lastLoginAt: string | null
  lastActiveAt: string | null
  lessonsStarted: number
  sectionsVisited: number
  gamesPlayed: number
}

export interface StudentDetail {
  student: User
  progress: SectionVisit[]
  gameResults: GameResult[]
}
