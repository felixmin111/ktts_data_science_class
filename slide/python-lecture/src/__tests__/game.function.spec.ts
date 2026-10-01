import { describe, expect, it } from 'vitest'
import { buildRound, rankFor, scoreAnswer } from '@/functions/game.function'
import { games } from '@/data/games'
import type { GameQuestion } from '@/models/game.model'

const bank: GameQuestion[] = Array.from({ length: 12 }, (_, index) => ({
  prompt: `Q${index}`,
  options: ['a', 'b', 'c', 'd'],
  answer: index % 4,
  explanation: ''
}))

describe('buildRound', () => {
  it('returns the requested number of unique questions', () => {
    const round = buildRound(bank, 5)
    expect(round).toHaveLength(5)
    expect(new Set(round.map((q) => q.prompt)).size).toBe(5)
  })

  it('keeps the answer pointing at the same option after shuffling', () => {
    for (const question of buildRound(bank, 12)) {
      const original = bank.find((q) => q.prompt === question.prompt)!
      expect(question.options[question.answer]).toBe(original.options[original.answer])
    }
  })

  it('never asks for more questions than the bank has', () => {
    expect(buildRound(bank, 50)).toHaveLength(12)
  })
})

describe('scoreAnswer', () => {
  it('gives nothing for a wrong answer', () => {
    expect(scoreAnswer(false, 9, 0)).toBe(0)
  })

  it('adds speed and streak bonuses', () => {
    expect(scoreAnswer(true, 0, 1)).toBe(100)
    expect(scoreAnswer(true, 5, 1)).toBe(150)
    expect(scoreAnswer(true, 5, 3)).toBe(200)
  })
})

describe('rankFor', () => {
  it('ranks by accuracy', () => {
    expect(rankFor(1).title).toBe('Pythonista')
    expect(rankFor(0.2).title).toBe('Explorer')
  })
})

describe('game banks', () => {
  it.each(games.map((game) => [game.id, game] as const))('%s has valid questions', (_, game) => {
    expect(game.bank.length).toBeGreaterThanOrEqual(game.questionsPerRound)
    for (const question of game.bank) {
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(question.options.length)
      expect(new Set(question.options).size).toBe(question.options.length)
    }
  })
})
