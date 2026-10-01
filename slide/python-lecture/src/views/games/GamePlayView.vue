<script setup lang="ts">
import { findGame } from '@/data/games'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const route = useRoute()
const game = computed(() => findGame(String(route.params.gameId)))
</script>

<template>
  <div class="container play">
    <RouterLink :to="{ name: Routes.GAMES.name }" class="play__back">
      <IconMdiArrowLeft /> {{ t('game.allGames') }}
    </RouterLink>
    <QuizGame v-if="game" :key="game.id" :game="game" />
    <a-result v-else status="404" :title="t('game.notFound')" />
  </div>
</template>

<style scoped lang="scss">
.play {
  padding-top: 24px;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
    color: $color-muted;
  }
}
</style>
