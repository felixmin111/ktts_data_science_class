import type { Lesson, Track, TrackId } from '@/models/lesson.model'
import { localize } from '@/functions/localize.function'
import { activeContentTranslation } from '@/i18n/content'
import day1 from './day1.lesson'
import dsDay1 from './dataScience/day01WhatIsDataScience.lesson'
import dsDay2 from './dataScience/day02DataStatistics.lesson'
import dsDay3 from './dataScience/day03ThinkingWithData.lesson'
import dsDay4 from './dataScience/day04Collections.lesson'
import dsDay5 from './dataScience/day05LoopsFunctions.lesson'
import dsDay6 from './dataScience/day06Numpy.lesson'
import dsDay7 from './dataScience/day07Pandas.lesson'
import dsDay8 from './dataScience/day08CleanGroup.lesson'
import dsDay9 from './dataScience/day09Visualization.lesson'
import dsDay10 from './dataScience/day10Project.lesson'

export const tracks: Track[] = [
  {
    id: 'foundations',
    title: 'Python Foundations',
    description: 'How Python thinks: values, names, types and talking to the user.',
    labelPrefix: 'Day'
  },
  {
    id: 'data-science',
    title: 'Python for Data Science',
    description:
      'Days 1–3: the theory, with real-world case studies. Days 4–10: Python, NumPy, pandas and charts, ending with a real analysis project.',
    labelPrefix: 'Day'
  }
]

const comingSoon = (day: number, title: string, topics: string[]): Lesson => ({
  id: `day-${day}`,
  track: 'foundations',
  day,
  title,
  summary: 'Coming soon.',
  durationMinutes: 60,
  topics,
  sections: [],
  available: false
})

export const lessons: Lesson[] = [
  day1,
  comingSoon(2, 'Numbers, operators and a calculator', [
    'Type conversion',
    'Operators',
    'Calculator'
  ]),
  dsDay1,
  dsDay2,
  dsDay3,
  dsDay4,
  dsDay5,
  dsDay6,
  dsDay7,
  dsDay8,
  dsDay9,
  dsDay10
]

const localizedCache = new WeakMap<object, { tracks: Track[]; lessons: Lesson[] }>()

/** Tracks and lessons in the active locale (falls back to English for anything untranslated). */
function localized(): { tracks: Track[]; lessons: Lesson[] } {
  const translation = activeContentTranslation()
  if (!translation) return { tracks, lessons }

  let cached = localizedCache.get(translation)
  if (!cached) {
    cached = {
      tracks: tracks.map((track) => localize(track, translation.tracks[track.id])),
      lessons: lessons.map((lesson) => localize(lesson, translation.lessons[lesson.id]))
    }
    localizedCache.set(translation, cached)
  }
  return cached
}

export function getTracks(): Track[] {
  return localized().tracks
}

export function findLesson(id: string): Lesson | undefined {
  return localized().lessons.find((lesson) => lesson.id === id)
}

export function lessonsInTrack(trackId: TrackId): Lesson[] {
  return localized().lessons.filter((lesson) => lesson.track === trackId)
}

export function lessonLabel(lesson: Lesson): string {
  const prefix = getTracks().find((track) => track.id === lesson.track)?.labelPrefix ?? 'Lesson'
  return `${prefix} ${lesson.day}`
}
