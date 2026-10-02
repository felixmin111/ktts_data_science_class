import { describe, expect, it } from 'vitest'
import { lessonCompletion } from '@/functions/progress.function'
import type { Lesson } from '@/models/lesson.model'
import type { SectionVisit } from '@/models/progress.model'

const lesson = { id: 'lesson', sections: [{ id: 'a' }, { id: 'b' }] } as Lesson
const visit = (sectionId: string, lessonId = 'lesson') => ({ sectionId, lessonId }) as SectionVisit

describe('lesson completion', () => {
  it('does not count duplicate, obsolete, or other-lesson section visits', () => {
    const result = lessonCompletion(lesson, [
      visit('a'),
      visit('a'),
      visit('old'),
      visit('b', 'other')
    ])
    expect(result.visited).toBe(1)
    expect(result.percent).toBe(50)
    expect(result.status).toBe('inProgress')
    expect(result.sections.map((section) => section.visited)).toEqual([true, false])
  })
  it('requires every current section for completion', () => {
    expect(lessonCompletion(lesson, []).status).toBe('notStarted')
    expect(lessonCompletion(lesson, [visit('a'), visit('b')]).complete).toBe(true)
    expect(lessonCompletion({ id: 'empty', sections: [] }, []).complete).toBe(false)
  })
  it('does not round incomplete lessons up to 100 percent', () => {
    const longLesson = {
      id: 'lesson',
      sections: Array.from({ length: 201 }, (_, i) => ({ id: String(i) }))
    } as Lesson
    const result = lessonCompletion(
      longLesson,
      Array.from({ length: 200 }, (_, i) => visit(String(i)))
    )
    expect(result.percent).toBe(99)
    expect(result.complete).toBe(false)
  })
})
