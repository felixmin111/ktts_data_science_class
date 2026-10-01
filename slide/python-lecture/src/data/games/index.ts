import type { GameDefinition } from '@/models/game.model'
import type { TrackId } from '@/models/lesson.model'
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

export function findGame(id: string): GameDefinition | undefined {
  return games.find((game) => game.id === id)
}

/** Games of one track, in lesson order. */
export function gamesInTrack(trackId: TrackId): GameDefinition[] {
  return games.filter((game) => game.track === trackId).sort((a, b) => a.day - b.day)
}
