<script setup lang="ts">
import { findGame } from '@/data/games'
import { findLesson, lessonLabel } from '@/data/lessons'
import type { GameResult, SectionVisit } from '@/models/progress.model'

const props = defineProps<{ progress: SectionVisit[]; gameResults: GameResult[] }>()

const { t } = useI18n()
const formatDate = useDateFormat()

interface LessonRow {
  lessonId: string
  label: string
  title: string
  percent: number
  sectionsVisited: number
  lastVisitedAt: string
}

const lessonRows = computed<LessonRow[]>(() => {
  const byLesson = new Map<string, SectionVisit[]>()
  for (const visit of props.progress) {
    byLesson.set(visit.lessonId, [...(byLesson.get(visit.lessonId) ?? []), visit])
  }
  return [...byLesson.entries()]
    .map(([lessonId, visits]) => {
      const lesson = findLesson(lessonId)
      const total = lesson?.sections.length ?? 0
      return {
        lessonId,
        label: lesson ? lessonLabel(lesson) : '',
        title: lesson?.title ?? lessonId,
        percent: total ? Math.min(100, Math.round((visits.length / total) * 100)) : 0,
        sectionsVisited: visits.length,
        lastVisitedAt:
          visits
            .map((visit) => visit.lastVisitedAt)
            .sort()
            .at(-1) ?? ''
      }
    })
    .sort((a, b) => b.lastVisitedAt.localeCompare(a.lastVisitedAt))
})

const bestByGame = computed(() => {
  const best = new Map<string, GameResult>()
  for (const result of props.gameResults) {
    const current = best.get(result.gameId)
    if (!current || result.score > current.score) best.set(result.gameId, result)
  }
  return best
})

const stats = computed(() => [
  { key: 'lessonsStarted', value: lessonRows.value.length },
  { key: 'sectionsVisited', value: props.progress.length },
  { key: 'gamesPlayed', value: props.gameResults.length },
  {
    key: 'accuracy',
    value: props.gameResults.length
      ? `${Math.round(
          (props.gameResults.reduce((sum, r) => sum + r.correct, 0) /
            props.gameResults.reduce((sum, r) => sum + r.total, 0)) *
            100
        )}%`
      : '—'
  }
])

const lessonColumns = computed(() => [
  { title: t('history.lesson'), key: 'lesson' },
  { title: t('history.progress'), key: 'percent', width: 220 },
  { title: t('history.lastVisited'), key: 'lastVisitedAt', width: 200 }
])

const gameColumns = computed(() => [
  { title: t('history.game'), key: 'game' },
  { title: t('game.score'), key: 'score', width: 110 },
  { title: t('history.correct'), key: 'correct', width: 120 },
  { title: t('game.streak'), key: 'bestStreak', width: 110 },
  { title: t('history.playedAt'), key: 'playedAt', width: 200 }
])
</script>

<template>
  <div class="report">
    <div class="report__stats">
      <div v-for="stat in stats" :key="stat.key" class="report__stat">
        <span class="report__stat-value">{{ stat.value }}</span>
        <span class="report__stat-label">{{ t(`history.stats.${stat.key}`) }}</span>
      </div>
    </div>

    <section class="report__block">
      <h2>{{ t('history.lessonsTitle') }}</h2>
      <a-table
        :columns="lessonColumns"
        :data-source="lessonRows"
        row-key="lessonId"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        :locale="{ emptyText: t('history.noLessons') }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'lesson'">
            <span class="report__muted">{{ record.label }}</span> · {{ record.title }}
          </template>
          <template v-else-if="column.key === 'percent'">
            <a-progress :percent="record.percent" size="small" stroke-color="#2A62A6" />
          </template>
          <template v-else-if="column.key === 'lastVisitedAt'">
            {{ formatDate(record.lastVisitedAt) }}
          </template>
        </template>
      </a-table>
    </section>

    <section class="report__block">
      <h2>{{ t('history.gamesTitle') }}</h2>
      <a-table
        :columns="gameColumns"
        :data-source="gameResults"
        row-key="id"
        :pagination="{ pageSize: 10, hideOnSinglePage: true }"
        :scroll="{ x: 'max-content' }"
        :locale="{ emptyText: t('history.noGames') }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'game'">
            {{ findGame(record.gameId)?.title ?? record.gameId }}
            <a-tag v-if="bestByGame.get(record.gameId)?.id === record.id" color="gold">
              {{ t('history.best') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'score'">{{ record.score }}</template>
          <template v-else-if="column.key === 'correct'">
            {{ record.correct }} / {{ record.total }}
          </template>
          <template v-else-if="column.key === 'bestStreak'">{{ record.bestStreak }}</template>
          <template v-else-if="column.key === 'playedAt'">
            {{ formatDate(record.playedAt) }}
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<style scoped lang="scss">
.report {
  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @include mobile {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 20px;
    border-radius: $radius;
    border: 1px solid $color-line;
    background: $color-card;
  }

  &__stat-value {
    font-family: $font-display;
    font-size: 30px;
    font-weight: 700;
    color: $color-ink;
  }

  &__stat-label {
    color: $color-muted;
    font-size: 14px;
  }

  &__block {
    margin-top: 40px;

    h2 {
      margin-bottom: 16px;
    }
  }

  &__muted {
    color: $color-muted;
  }
}
</style>
