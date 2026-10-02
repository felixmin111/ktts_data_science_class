<script setup lang="ts">
import { rankFor } from '@/functions/game.function'
import type { GameDefinition } from '@/models/game.model'
import Routes from '@/router/uri.route'

const props = defineProps<{ game: GameDefinition }>()
const { t } = useI18n()

const engine = useGameEngine(() => props.game)
const {
  phase,
  questions,
  index,
  current,
  score,
  streak,
  bestStreak,
  answers,
  lastAnswer,
  correctCount,
  secondsLeft,
  timePercent,
  isNewBest,
  saveFailed
} = engine

const best = computed(() => useScoreStore().bestFor(props.game.id))
const rank = computed(() => rankFor(correctCount.value / Math.max(1, questions.value.length)))
const isLast = computed(() => index.value + 1 >= questions.value.length)

onKeyStroke((event) => {
  if (phase.value === 'playing') {
    const choice = Number(event.key) - 1
    if (current.value && choice >= 0 && choice < current.value.options.length) {
      engine.answer(choice)
    }
  } else if (phase.value === 'feedback' && event.key === 'Enter') {
    engine.next()
  }
})

function optionState(optionIndex: number) {
  if (phase.value !== 'feedback' || !current.value || !lastAnswer.value) return ''
  if (optionIndex === current.value.answer) return 'option--right'
  if (optionIndex === lastAnswer.value.chosen) return 'option--wrong'
  return 'option--dim'
}
</script>

<template>
  <div class="game" :style="{ '--accent': game.color }">
    <!-- Intro -->
    <section v-if="phase === 'intro'" class="game__panel game__intro">
      <span class="game__badge"><GameIcon :icon="game.icon" /></span>
      <h1>{{ game.title }}</h1>
      <p class="game__lead">{{ game.tagline }}</p>
      <div class="game__chips">
        <a-tag>{{ t('game.questions', { n: game.questionsPerRound }) }}</a-tag>
        <a-tag>{{ t('game.seconds', { n: game.secondsPerQuestion }) }}</a-tag>
        <a-tag v-if="best" color="gold">{{ t('game.best', { score: best.score }) }}</a-tag>
      </div>
      <a-button type="primary" size="large" class="game__cta" @click="engine.start()">
        <template #icon><IconMdiPlay /></template>
        {{ t('game.play') }}
      </a-button>
      <p class="game__hint">{{ t('game.keyboardHint') }}</p>
    </section>

    <!-- Playing / feedback -->
    <section
      v-else-if="(phase === 'playing' || phase === 'feedback') && current"
      class="game__panel"
    >
      <div class="game__hud">
        <span>{{ t('game.question', { current: index + 1, total: questions.length }) }}</span>
        <span class="game__stat"><IconMdiStarFourPoints /> {{ t('game.score') }} {{ score }}</span>
        <span class="game__stat" :class="{ 'game__stat--hot': streak >= 3 }">
          <IconMdiFire /> {{ t('game.streak') }} {{ streak }}
        </span>
        <a-button size="small" type="text" @click="engine.quit()">{{ t('game.quit') }}</a-button>
      </div>

      <div class="game__timer">
        <div
          class="game__timer-fill"
          :class="{ 'game__timer-fill--low': secondsLeft < 3 }"
          :style="{ width: `${timePercent}%` }"
        />
      </div>

      <p class="game__prompt">{{ current.prompt }}</p>
      <CodeRunner v-if="current.code" :key="index" :code="current.code" />

      <div class="game__options">
        <button
          v-for="(option, optionIndex) in current.options"
          :key="option"
          type="button"
          class="option"
          :class="optionState(optionIndex)"
          :disabled="phase === 'feedback'"
          @click="engine.answer(optionIndex)"
        >
          <span class="option__key">{{ optionIndex + 1 }}</span>
          <code class="option__text">{{ option }}</code>
        </button>
      </div>

      <div v-if="phase === 'feedback' && lastAnswer" class="game__feedback">
        <div>
          <p
            class="game__verdict"
            :class="lastAnswer.correct ? 'game__verdict--ok' : 'game__verdict--bad'"
          >
            <template v-if="lastAnswer.correct">
              {{ t('game.correct', { points: lastAnswer.points }) }}
            </template>
            <template v-else-if="lastAnswer.chosen === null">{{ t('game.timeUp') }}</template>
            <template v-else>{{ t('game.wrong') }}</template>
          </p>
          <p class="game__explain">{{ current.explanation }}</p>
        </div>
        <a-button type="primary" size="large" @click="engine.next()">
          {{ isLast ? t('game.seeResults') : t('game.next') }}
        </a-button>
      </div>
    </section>

    <!-- Results -->
    <section v-else-if="phase === 'finished'" class="game__panel game__results">
      <p class="game__eyebrow">{{ t('game.finishedTitle') }}</p>
      <h1>{{ t(`game.rank.${rank}.title`) }}</h1>
      <p class="game__lead">{{ t(`game.rank.${rank}.message`) }}</p>
      <div class="game__score">{{ score }}</div>
      <a-alert v-if="saveFailed" type="warning" show-icon :message="t('game.saveFailed')" />
      <a-tag v-if="isNewBest" color="gold" class="game__new-best">
        <IconMdiTrophy /> {{ t('game.newBest') }}
      </a-tag>
      <p>
        {{ t('game.accuracy', { correct: correctCount, total: questions.length }) }} ·
        {{ t('game.bestStreak', { n: bestStreak }) }}
      </p>

      <div class="game__actions">
        <a-button type="primary" size="large" @click="engine.start()">
          {{ t('game.playAgain') }}
        </a-button>
        <RouterLink :to="{ name: Routes.GAMES.name }">
          <a-button size="large">{{ t('game.allGames') }}</a-button>
        </RouterLink>
      </div>

      <h3 class="game__review-title">{{ t('game.review') }}</h3>
      <ol class="game__review">
        <li
          v-for="record in answers"
          :key="record.questionIndex"
          :class="record.correct ? 'ok' : 'bad'"
        >
          <span class="game__review-mark">
            <IconMdiCheckCircle v-if="record.correct" />
            <IconMdiCloseCircle v-else />
          </span>
          <code>{{
            questions[record.questionIndex]?.code ?? questions[record.questionIndex]?.prompt
          }}</code>
          <span class="game__review-answer">
            {{
              t('game.answerWas', {
                answer:
                  questions[record.questionIndex]?.options[
                    questions[record.questionIndex]?.answer ?? 0
                  ]
              })
            }}
          </span>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped lang="scss">
.game {
  max-width: 820px;
  margin: 0 auto;

  &__panel {
    @include card;

    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 32px;

    @include mobile {
      padding: 20px 16px;
    }
  }

  &__intro,
  &__results {
    align-items: center;
    text-align: center;

    h1 {
      font-size: 40px;
    }
  }

  &__badge {
    display: grid;
    place-items: center;
    width: 80px;
    height: 80px;
    border-radius: 22px;
    background: var(--accent);
    color: #fff;
    font-size: 44px;
  }

  &__lead {
    font-size: 18px;
    color: $color-body;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }

  &__cta {
    min-width: 180px;
    background: var(--accent);
  }

  &__hint {
    font-size: 13px;
    color: $color-muted;
  }

  &__hud {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    font-weight: 600;
    color: $color-body;

    > :last-child {
      margin-left: auto;
    }
  }

  &__stat {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &--hot {
      color: #c2410c;
    }
  }

  &__timer {
    height: 8px;
    border-radius: 999px;
    background: $color-line;
    overflow: hidden;
  }

  &__timer-fill {
    height: 100%;
    background: var(--accent);
    transition: width 100ms linear;

    &--low {
      background: $color-red;
    }
  }

  &__prompt {
    font-size: 20px;
    font-weight: 600;
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
  }

  &__feedback {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    border-radius: $radius;
    background: $color-paper;

    @include mobile {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__verdict {
    font-size: 18px;
    font-weight: 700;

    &--ok {
      color: $color-green;
    }

    &--bad {
      color: $color-red;
    }
  }

  &__explain {
    color: $color-body;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__score {
    font-family: $font-display;
    font-size: 72px;
    font-weight: 700;
    line-height: 1;
    color: var(--accent);
  }

  &__new-best {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    padding: 4px 12px;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }

  &__review-title {
    align-self: flex-start;
    margin-top: 12px;
  }

  &__review {
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid $color-line;

      code {
        flex: 1;
        white-space: pre-wrap;
      }

      &.ok .game__review-mark {
        color: $color-green;
      }

      &.bad .game__review-mark {
        color: $color-red;
      }
    }
  }

  &__review-mark {
    display: flex;
    font-size: 20px;
  }

  &__review-answer {
    font-size: 14px;
    color: $color-muted;
  }
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid $color-line;
  border-radius: $radius-sm;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 120ms,
    transform 120ms;

  &:hover:not(:disabled) {
    border-color: var(--accent);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
  }

  &__key {
    display: grid;
    place-items: center;
    flex: none;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: $color-paper;
    font-size: 13px;
    font-weight: 700;
    color: $color-muted;
  }

  &__text {
    background: none;
    padding: 0;
    font-size: 16px;
    white-space: pre-wrap;
  }

  &--right {
    border-color: $color-green;
    background: rgba($color-green, 0.1);
  }

  &--wrong {
    border-color: $color-red;
    background: rgba($color-red, 0.08);
  }

  &--dim {
    opacity: 0.5;
  }
}
</style>
