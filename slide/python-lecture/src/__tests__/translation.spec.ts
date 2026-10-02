import { describe, expect, it } from 'vitest'
import { games } from '@/data/games'
import { lessons, tracks } from '@/data/lessons'
import { contentTranslations } from '@/i18n/content'
import { localize } from '@/functions/localize.function'
import type { LessonBlock } from '@/models/lesson.model'
import type { BlockTranslation, LessonTranslation } from '@/models/translation.model'

type Shaped = Record<string, unknown>

/** The sizes that must line up, limited to the fields the translation actually provides. */
function blockShape(block: LessonBlock | BlockTranslation, provided: BlockTranslation): Shaped {
  const shape: Shaped = { type: block.type }
  if ('columns' in provided && 'columns' in block) shape.columns = block.columns.length
  if ('rows' in provided && provided.rows && 'rows' in block && block.rows) {
    shape.rows = block.rows.map((row) => row.length)
  }
  if ('body' in provided && Array.isArray(provided.body) && 'body' in block) {
    shape.body = Array.isArray(block.body) ? block.body.length : block.body
  }
  if ('options' in provided && provided.options && 'options' in block && block.options) {
    shape.options = block.options.length
  }
  return shape
}

/** Section ids plus each block's shape; comparing two of these pinpoints any misalignment. */
function lessonShape(
  source: (typeof lessons)[number],
  translation: LessonTranslation,
  useSource: boolean
) {
  const sections = translation.sections ?? []
  return {
    topics: translation.topics
      ? (useSource ? source.topics : translation.topics).length
      : undefined,
    sections: (useSource ? source.sections : sections).map((section, sectionIndex) => ({
      id: section.id,
      blocks: section.blocks.map((block, blockIndex) => {
        const provided = sections[sectionIndex]?.blocks[blockIndex]
        return provided ? blockShape(block, provided) : { missing: true }
      })
    }))
  }
}

describe.each(Object.entries(contentTranslations))('%s content translation', (_, content) => {
  it('translates every track', () => {
    expect(Object.keys(content!.tracks).sort()).toEqual(tracks.map((track) => track.id).sort())
  })

  it('translates every lesson and game', () => {
    expect(Object.keys(content!.lessons).sort()).toEqual(lessons.map((lesson) => lesson.id).sort())
    expect(Object.keys(content!.games).sort()).toEqual(games.map((game) => game.id).sort())
  })

  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    'lesson %s lines up with the English source',
    (id, lesson) => {
      const translation = content!.lessons[id]!
      expect(lessonShape(lesson, translation, false)).toEqual(
        lessonShape(lesson, translation, true)
      )
    }
  )

  it.each(games.map((game) => [game.id, game] as const))(
    'game %s lines up with the English source',
    (id, game) => {
      const translation = content!.games[id]!
      const shape = (options: (string[] | undefined)[]) => options.map((list) => list?.length)
      expect(translation.bank).toHaveLength(game.bank.length)
      expect(shape(translation.bank.map((question) => question.options))).toEqual(
        shape(
          game.bank.map((question, index) =>
            translation.bank[index]?.options ? question.options : undefined
          )
        )
      )
    }
  )

  it('keeps code and answers from the English source', () => {
    const game = games[0]!
    const localized = localize(game, content!.games[game.id])
    expect(localized.bank.map((q) => [q.code, q.answer])).toEqual(
      game.bank.map((q) => [q.code, q.answer])
    )
  })
})
