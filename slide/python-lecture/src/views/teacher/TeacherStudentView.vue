<script setup lang="ts">
import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import type { StudentDetail } from '@/models/progress.model'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const route = useRoute()
const formatDate = useDateFormat()

const detail = ref<StudentDetail | null>(null)
const loading = ref(true)
const failed = ref(false)

onMounted(async () => {
  try {
    const studentId = encodeURIComponent(String(route.params.studentId))
    const { data } = await httpClient.get<StudentDetail>(
      `${EndpointUri.TEACHER_STUDENTS}/${studentId}`
    )
    detail.value = data
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container student">
    <RouterLink :to="{ name: Routes.TEACHER.name }" class="student__back">
      <IconMdiArrowLeft /> {{ t('teacher.allStudents') }}
    </RouterLink>

    <a-result v-if="failed" status="404" :title="t('teacher.studentNotFound')" />
    <a-skeleton v-else-if="loading" active />
    <template v-else-if="detail">
      <h1>{{ detail.student.displayName }}</h1>
      <p class="student__lead">
        {{ detail.student.email }} ·
        {{ t('teacher.joined', { date: formatDate(detail.student.createdAt) }) }}
      </p>
      <ProgressReport :progress="detail.progress" :game-results="detail.gameResults" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.student {
  padding-top: 32px;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
  }

  &__lead {
    margin: 8px 0 28px;
    color: $color-muted;
  }
}
</style>
