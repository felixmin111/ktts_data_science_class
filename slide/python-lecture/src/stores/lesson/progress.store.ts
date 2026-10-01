import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', () => {
  /** lessonId → ids of sections the learner has opened. */
  const visited = useLocalStorage<Record<string, string[]>>('pl-progress', {})
  const teacherMode = useLocalStorage('pl-teacher-mode', false)

  function markVisited(lessonId: string, sectionId: string) {
    const current = visited.value[lessonId] ?? []
    if (!current.includes(sectionId)) {
      visited.value = { ...visited.value, [lessonId]: [...current, sectionId] }
    }
  }

  function percent(lessonId: string, totalSections: number): number {
    if (!totalSections) return 0
    return Math.round(((visited.value[lessonId]?.length ?? 0) / totalSections) * 100)
  }

  function reset(lessonId: string) {
    const { [lessonId]: _removed, ...rest } = visited.value
    visited.value = rest
  }

  return { visited, teacherMode, markVisited, percent, reset }
})
