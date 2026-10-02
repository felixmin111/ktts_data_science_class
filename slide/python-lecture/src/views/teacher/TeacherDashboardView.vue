<script setup lang="ts">
import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import type { StudentSummary } from '@/models/progress.model'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const formatDate = useDateFormat()

const students = ref<StudentSummary[]>([])
const search = ref('')
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
    title: t('history.stats.lessonsStarted'),
    key: 'lessonsStarted',
    width: 150,
    sorter: (a: StudentSummary, b: StudentSummary) => a.lessonsStarted - b.lessonsStarted
  },
  {
    title: t('history.stats.sectionsVisited'),
    key: 'sectionsVisited',
    width: 150,
    sorter: (a: StudentSummary, b: StudentSummary) => a.sectionsVisited - b.sectionsVisited
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

onMounted(async () => {
  try {
    const { data } = await httpClient.get<StudentSummary[]>(EndpointUri.TEACHER_STUDENTS)
    students.value = data
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
})
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
        <template v-else-if="column.key === 'lessonsStarted'">{{ record.lessonsStarted }}</template>
        <template v-else-if="column.key === 'sectionsVisited'">
          {{ record.sectionsVisited }}
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
