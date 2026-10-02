import { defineStore } from 'pinia'

import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import type { SectionVisit } from '@/models/progress.model'

/** Lesson progress, stored on the server per account. */
export const useProgressStore = defineStore('progress', () => {
  /** lessonId → ids of sections the learner has opened. */
  const visited = ref<Record<string, string[]>>({})
  /** Only used by teachers (the switch is hidden for students). */
  const teacherMode = useLocalStorage('pl-teacher-mode', false)

  async function load() {
    const { data } = await httpClient.get<SectionVisit[]>(EndpointUri.PROGRESS)
    const next: Record<string, string[]> = {}
    for (const visit of data) {
      ;(next[visit.lessonId] ??= []).push(visit.sectionId)
    }
    visited.value = next
  }

  function markVisited(lessonId: string, sectionId: string) {
    const current = visited.value[lessonId] ?? []
    if (!current.includes(sectionId)) {
      visited.value = { ...visited.value, [lessonId]: [...current, sectionId] }
    }
    // Every visit is sent (the server keeps visit counts and timestamps as history).
    httpClient
      .put(
        `${EndpointUri.PROGRESS}/${encodeURIComponent(lessonId)}/${encodeURIComponent(sectionId)}`
      )
      .catch(() => undefined)
  }

  function percent(lessonId: string, totalSections: number): number {
    if (!totalSections) return 0
    return Math.round(((visited.value[lessonId]?.length ?? 0) / totalSections) * 100)
  }

  async function reset(lessonId: string) {
    await httpClient.delete(`${EndpointUri.PROGRESS}/${encodeURIComponent(lessonId)}`)
    const { [lessonId]: _removed, ...rest } = visited.value
    visited.value = rest
  }

  function clear() {
    visited.value = {}
  }

  return { visited, teacherMode, load, markVisited, percent, reset, clear }
})
