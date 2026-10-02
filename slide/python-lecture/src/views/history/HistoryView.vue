<script setup lang="ts">
import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import type { GameResult, Page, SectionVisit } from '@/models/progress.model'

const HISTORY_SIZE = 100

const { t } = useI18n()
const auth = useAuthStore()

const progress = ref<SectionVisit[]>([])
const gameResults = ref<GameResult[]>([])
const loading = ref(true)
const failed = ref(false)

onMounted(async () => {
  try {
    const [progressResponse, gamesResponse] = await Promise.all([
      httpClient.get<SectionVisit[]>(EndpointUri.PROGRESS),
      httpClient.get<Page<GameResult>>(EndpointUri.GAME_RESULTS, {
        params: { size: HISTORY_SIZE }
      })
    ])
    progress.value = progressResponse.data
    gameResults.value = gamesResponse.data.items
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container history">
    <h1>{{ t('history.title') }}</h1>
    <p class="history__lead">{{ t('history.lead', { name: auth.user?.displayName }) }}</p>

    <a-alert v-if="failed" type="error" show-icon :message="t('errors.INTERNAL_ERROR')" />
    <a-skeleton v-else-if="loading" active />
    <ProgressReport v-else :progress="progress" :game-results="gameResults" />
  </div>
</template>

<style scoped lang="scss">
.history {
  padding-top: 40px;

  &__lead {
    margin: 8px 0 28px;
    color: $color-muted;
  }
}
</style>
