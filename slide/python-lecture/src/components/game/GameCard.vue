<script setup lang="ts">
import type { GameDefinition } from '@/models/game.model'
import Routes from '@/router/uri.route'

const props = defineProps<{ game: GameDefinition }>()
const { t } = useI18n()
const best = computed(() => useScoreStore().bestFor(props.game.id))
</script>

<template>
  <RouterLink
    :to="{ name: Routes.GAME_PLAY.name, params: { gameId: game.id } }"
    class="game-card"
    :style="{ '--accent': game.color }"
  >
    <div class="game-card__top">
      <span class="game-card__icon"><GameIcon :icon="game.icon" /></span>
      <span class="game-card__day">{{ t('game.practises', { n: game.day }) }}</span>
    </div>
    <h3 class="game-card__title">{{ game.title }}</h3>
    <p class="game-card__tagline">{{ game.tagline }}</p>
    <div class="game-card__meta">
      <a-tag>{{ t('game.questions', { n: game.questionsPerRound }) }}</a-tag>
      <a-tag>{{ t('game.seconds', { n: game.secondsPerQuestion }) }}</a-tag>
    </div>
    <p class="game-card__best">
      <IconMdiTrophyOutline />
      {{ best ? t('game.best', { score: best.score }) : t('game.noBest') }}
    </p>
  </RouterLink>
</template>

<style scoped lang="scss">
.game-card {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  color: $color-ink;
  border-top: 6px solid var(--accent);
  transition:
    transform 160ms,
    box-shadow 160ms;

  &:hover {
    color: $color-ink;
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba($color-navy, 0.1);
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__day {
    @include eyebrow($color-muted);
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--accent);
    color: #fff;
    font-size: 28px;
  }

  &__title {
    font-size: 22px;
  }

  &__tagline {
    color: $color-body;
  }

  &__meta {
    display: flex;
    gap: 4px;
  }

  &__best {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    font-size: 14px;
    color: $color-muted;
  }
}
</style>
