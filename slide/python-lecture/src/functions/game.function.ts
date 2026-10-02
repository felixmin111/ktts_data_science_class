import { shuffle } from 'lodash-es'
import type { GameQuestion } from '@/models/game.model'

export const BASE_POINTS = 100
export const SPEED_POINTS_PER_SECOND = 10
export const STREAK_BONUS = 25

/** Picks `count` random questions and shuffles each question's options (answer index follows). */
export function buildRound(bank: GameQuestion[], count: number): GameQuestion[] {
  return shuffle(bank)
    .slice(0, Math.min(count, bank.length))
    .map((question) => {
      const order = shuffle(question.options.map((_, index) => index))
      return {
        ...question,
        options: order.map((index) => question.options[index] ?? ''),
        answer: order.indexOf(question.answer)
      }
    })
}

/** Points for a correct answer: base + speed bonus + streak bonus (streak counts this answer). */
export function scoreAnswer(correct: boolean, secondsLeft: number, streak: number): number {
  if (!correct) return 0
  const speed = Math.max(0, Math.ceil(secondsLeft)) * SPEED_POINTS_PER_SECOND
  const streakBonus = Math.max(0, streak - 1) * STREAK_BONUS
  return BASE_POINTS + speed + streakBonus
}

export type RankKey = 'pythonista' | 'detective' | 'apprentice' | 'explorer'

/** Rank for a round's accuracy; its title and message live under `game.rank.<key>` in the locales. */
export function rankFor(accuracy: number): RankKey {
  if (accuracy >= 0.9) return 'pythonista'
  if (accuracy >= 0.7) return 'detective'
  if (accuracy >= 0.5) return 'apprentice'
  return 'explorer'
}
