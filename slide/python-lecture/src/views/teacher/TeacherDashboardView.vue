<script setup lang="ts">
import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import { lessons, findLesson, lessonLabel } from '@/data/lessons'
import { findGame } from '@/data/games'
import { lessonCompletion } from '@/functions/progress.function'
import type { StudentDetail, StudentSummary } from '@/models/progress.model'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const formatDate = useDateFormat()

const students = ref<StudentSummary[]>([])
const details = ref<Record<string, StudentDetail>>({})
const detailFailures = ref<string[]>([])
const search = ref('')

const completedLessons = (id: string) =>
  lessons.filter((lesson) => lessonCompletion(lesson, details.value[id]?.progress ?? []).complete)
const gameScores = (id: string) => {
  const best = new Map<string, StudentDetail['gameResults'][number]>()
  for (const result of details.value[id]?.gameResults ?? []) {
    if (!best.has(result.gameId) || result.score > best.get(result.gameId)!.score)
      best.set(result.gameId, result)
  }
  return [...best.values()]
}
const totalCompleted = computed(() =>
  students.value.reduce((sum, student) => sum + completedLessons(student.id).length, 0)
)
const totalGames = computed(() =>
  students.value.reduce((sum, student) => sum + student.gamesPlayed, 0)
)
const loading = ref(true)
const failed = ref(false)

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return students.value
  return students.value.filter(
    (student) =>
      student.displayName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
  )
})

const columns = computed(() => [
  {
    title: t('teacher.student'),
    key: 'student',
    sorter: (a: StudentSummary, b: StudentSummary) => a.displayName.localeCompare(b.displayName)
  },
  {
    title: t('teacher.completedLessons'),
    key: 'completedLessons',
    width: 300,
    sorter: (a: StudentSummary, b: StudentSummary) =>
      completedLessons(a.id).length - completedLessons(b.id).length
  },
  {
    title: t('teacher.gameScores'),
    key: 'gameScores',
    width: 300
  },
  {
    title: t('history.stats.gamesPlayed'),
    key: 'gamesPlayed',
    width: 140,
    sorter: (a: StudentSummary, b: StudentSummary) => a.gamesPlayed - b.gamesPlayed
  },
  {
    title: t('teacher.lastActive'),
    key: 'lastActiveAt',
    width: 200,
    defaultSortOrder: 'descend' as const,
    sorter: (a: StudentSummary, b: StudentSummary) =>
      (a.lastActiveAt ?? '').localeCompare(b.lastActiveAt ?? '')
  }
])

async function loadStudents() {
  if (loading.value && students.value.length) return
  loading.value = true
  failed.value = false
  detailFailures.value = []
  details.value = {}
  try {
    const { data } = await httpClient.get<StudentSummary[]>(EndpointUri.TEACHER_STUDENTS)
    students.value = data
    await Promise.all(
      data.map(async (student) => {
        try {
          const response = await httpClient.get<StudentDetail>(
            `${EndpointUri.TEACHER_STUDENTS}/${encodeURIComponent(student.id)}`
          )
          details.value[student.id] = response.data
        } catch {
          detailFailures.value.push(student.id)
        }
      })
    )
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadStudents)
</script>

<template>
  <div class="container teacher">
    <div class="teacher__head">
      <div>
        <h1>{{ t('teacher.title') }}</h1>
        <p class="teacher__lead">{{ t('teacher.lead', { n: students.length }) }}</p>
      </div>
      <a-input-search
        v-model:value="search"
        :placeholder="t('teacher.search')"
        allow-clear
        class="teacher__search"
      />
    </div>

    <a-button :loading="loading" class="teacher__refresh" @click="loadStudents">{{
      t('teacher.refresh')
    }}</a-button>
    <p class="teacher__lead">{{ t('teacher.completionNote') }}</p>
    <div class="teacher__stats">
      <div>
        <strong>{{ students.length }}</strong
        ><span>{{ t('teacher.students') }}</span>
      </div>
      <div>
        <strong>{{ totalCompleted }}</strong
        ><span>{{ t('teacher.completedLessons') }}</span>
      </div>
      <div>
        <strong>{{ totalGames }}</strong
        ><span>{{ t('history.stats.gamesPlayed') }}</span>
      </div>
    </div>
    <a-alert
      v-if="detailFailures.length"
      type="warning"
      show-icon
      :message="t('teacher.partialFailure')"
    />
    <a-alert v-if="failed" type="error" show-icon :message="t('errors.INTERNAL_ERROR')" />
    <a-table
      v-else
      :columns="columns"
      :data-source="filtered"
      :loading="loading"
      row-key="id"
      :pagination="{ pageSize: 20, hideOnSinglePage: true }"
      :scroll="{ x: 'max-content' }"
      :locale="{ emptyText: t('teacher.noStudents') }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'student'">
          <RouterLink
            :to="{ name: Routes.TEACHER_STUDENT.name, params: { studentId: record.id } }"
            class="teacher__name"
          >
            {{ record.displayName }}
          </RouterLink>
          <div class="teacher__email">{{ record.email }}</div>
        </template>
        <template v-else-if="column.key === 'completedLessons'">
          <template v-if="details[record.id]">
            <strong>{{ completedLessons(record.id).length }} / {{ lessons.length }}</strong>
            <div
              v-for="lesson in completedLessons(record.id)"
              :key="lesson.id"
              class="teacher__item"
            >
              {{ lessonLabel(lesson) }} · {{ findLesson(lesson.id)?.title ?? lesson.title }}
            </div>
            <RouterLink
              :to="{ name: Routes.TEACHER_STUDENT.name, params: { studentId: record.id } }"
            >
              {{ t('teacher.viewProgress') }}
            </RouterLink>
          </template>
          <span v-else>{{ loading ? t('teacher.loading') : t('teacher.unavailable') }}</span>
        </template>
        <template v-else-if="column.key === 'gameScores'">
          <template v-if="details[record.id]">
            <div v-for="game in gameScores(record.id)" :key="game.gameId" class="teacher__item">
              {{ findGame(game.gameId)?.title ?? game.gameId }}: <strong>{{ game.score }}</strong> ·
              {{ game.correct }} / {{ game.total }}
            </div>
            <span v-if="!gameScores(record.id).length">{{ t('history.noGames') }}</span>
          </template>
          <span v-else>{{ t('teacher.unavailable') }}</span>
        </template>
        <template v-else-if="column.key === 'gamesPlayed'">{{ record.gamesPlayed }}</template>
        <template v-else-if="column.key === 'lastActiveAt'">
          {{ formatDate(record.lastActiveAt) }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="scss">
.teacher {
  &__refresh {
    margin-bottom: 12px;
  }
  &__item {
    margin: 8px 0;
    font-size: 13px;
  }
  &__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 24px 0;
  }
  &__stats div {
    padding: 16px;
    background: $color-card;
    border: 1px solid $color-line;
    border-radius: $radius;
  }
  &__stats strong {
    display: block;
    font-size: 28px;
  }
  &__stats span {
    color: $color-muted;
    font-size: 13px;
  }
  padding-top: 40px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  &__lead {
    margin-top: 8px;
    color: $color-muted;
  }

  &__search {
    width: 280px;
    max-width: 100%;
  }

  &__name {
    font-weight: 600;
  }

  &__email {
    color: $color-muted;
    font-size: 13px;
  }
}
</style>
