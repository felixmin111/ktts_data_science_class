import { defineStore } from 'pinia'

import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import type { GameResult, GameResultRequest, RecordedGame } from '@/models/progress.model'

/** Best score per game, stored on the server per account. Full history lives on the History page. */
export const useScoreStore = defineStore('score', () => {
  const best = ref<Record<string, GameResult>>({})

  async function load() {
    const { data } = await httpClient.get<GameResult[]>(EndpointUri.BEST_GAME_RESULTS)
    best.value = Object.fromEntries(data.map((result) => [result.gameId, result]))
  }

  /** Saves a finished round and returns true when it is a new best score. */
  async function record(request: GameResultRequest): Promise<boolean> {
    const { data } = await httpClient.post<RecordedGame>(EndpointUri.GAME_RESULTS, request)
    if (data.newBest) {
      best.value = { ...best.value, [request.gameId]: data.result }
    }
    return data.newBest
  }

  function bestFor(gameId: string): GameResult | undefined {
    return best.value[gameId]
  }

  function clear() {
    best.value = {}
  }

  return { best, load, record, bestFor, clear }
})
