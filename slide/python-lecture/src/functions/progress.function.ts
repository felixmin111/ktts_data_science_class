import type { Lesson } from '@/models/lesson.model'
import type { SectionVisit } from '@/models/progress.model'

/** Only current section IDs count; duplicate and obsolete visits cannot inflate completion. */
export function lessonCompletion(lesson: Pick<Lesson, 'id' | 'sections'>, visits: SectionVisit[]) {
  const opened = new Set(
    visits.filter((visit) => visit.lessonId === lesson.id).map((visit) => visit.sectionId)
  )
  const sections = lesson.sections.map((section) => ({
    ...section,
    visited: opened.has(section.id)
  }))
  const visited = sections.filter((section) => section.visited).length
  const complete = sections.length > 0 && visited === sections.length
  return {
    sections,
    visited,
    total: sections.length,
    complete,
    percent: sections.length ? Math.floor((visited / sections.length) * 100) : 0,
    status: complete ? 'completed' : visited ? 'inProgress' : 'notStarted'
  }
}
