import type { GameDefinition } from '@/models/game.model'
import type { TrackId } from '@/models/lesson.model'
import { localize } from '@/functions/localize.function'
import { activeContentTranslation } from '@/i18n/content'
import bugHunter from './bugHunter.game'
import caseMatch from './caseMatch.game'
import chartPicker from './chartPicker.game'
import correlationCausation from './correlationCausation.game'
import dataDetective from './dataDetective.game'
import pandasPredict from './pandasPredict.game'
import predictOutput from './predictOutput.game'
import statsIntuition from './statsIntuition.game'
import typeDetective from './typeDetective.game'

export const games: GameDefinition[] = [
  typeDetective,
  predictOutput,
  bugHunter,
  caseMatch,
  statsIntuition,
  correlationCausation,
  pandasPredict,
  dataDetective,
  chartPicker
]

const localizedCache = new WeakMap<object, GameDefinition[]>()

/** Games in the active locale (falls back to English for anything untranslated). */
export function getGames(): GameDefinition[] {
  const translation = activeContentTranslation()
  if (!translation) return games

  let cached = localizedCache.get(translation)
  if (!cached) {
    cached = games.map((game) => localize(game, translation.games[game.id]))
    localizedCache.set(translation, cached)
  }
  return cached
}

export function findGame(id: string): GameDefinition | undefined {
  return getGames().find((game) => game.id === id)
}

/** Games of one track, in lesson order. */
export function gamesInTrack(trackId: TrackId): GameDefinition[] {
  return getGames()
    .filter((game) => game.track === trackId)
    .sort((a, b) => a.day - b.day)
}
