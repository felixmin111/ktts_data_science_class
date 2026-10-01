import { defineStore } from 'pinia'

export interface GameResult {
  score: number
  correct: number
  total: number
  playedAt: string
}

export const useScoreStore = defineStore('score', () => {
  const best = useLocalStorage<Record<string, GameResult>>('pl-best-scores', {})

  /** Saves the result and returns true when it is a new best score. */
  function record(gameId: string, result: GameResult): boolean {
    const previous = best.value[gameId]
    if (previous && previous.score >= result.score) return false
    best.value = { ...best.value, [gameId]: result }
    return true
  }

  function bestFor(gameId: string): GameResult | undefined {
    return best.value[gameId]
  }

  return { best, record, bestFor }
})
