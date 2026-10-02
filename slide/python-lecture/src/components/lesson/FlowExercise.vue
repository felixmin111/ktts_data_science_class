<script setup lang="ts">
import { flowLeaves, flowPath, flowToPython } from '@/functions/flow.function'
import type { FlowBlock } from '@/models/lesson.model'

const props = defineProps<{ block: FlowBlock }>()
const { t } = useI18n()

const puzzle = computed(() => ({ setup: props.block.setup, tree: props.block.tree }))
const options = computed(() => flowLeaves(props.block.tree).map((leaf) => leaf.label))
const answer = computed(() => {
  const reached = flowPath(props.block.tree).at(-1)
  return flowLeaves(props.block.tree).findIndex((leaf) => leaf.id === reached)
})
const code = computed(() => flowToPython(puzzle.value))

const chosen = ref<number | null>(null)
const revealed = ref(false)
const done = ref(false)
/** Bumped on "Try again" so the chart remounts with a fresh animation. */
const attempt = ref(0)
const isCorrect = computed(() => chosen.value === answer.value)

function choose(index: number) {
  chosen.value = index
  revealed.value = true
}

function reset() {
  chosen.value = null
  revealed.value = false
  done.value = false
  attempt.value += 1
}
</script>

<template>
  <div class="flow-exercise" :class="{ 'flow-exercise--demo': block.demo }">
    <p class="flow-exercise__label">
      <IconMdiSitemap />
      {{ block.title ?? (block.demo ? t('lesson.flow.demo') : t('lesson.flow.exercise')) }}
    </p>
    <p v-if="!revealed" class="flow-exercise__hint">
      {{ block.demo ? t('lesson.flow.demoHint') : t('lesson.flow.hint') }}
    </p>

    <FlowBoard
      :key="attempt"
      :puzzle="puzzle"
      :options="options"
      :answer="answer"
      :chosen="block.demo ? undefined : chosen"
      :revealed="revealed"
      :clickable="!block.demo"
      :show-keys="false"
      @choose="choose"
      @done="done = true"
    />

    <div v-if="block.demo && !revealed" class="flow-exercise__actions">
      <a-button type="primary" @click="revealed = true">
        <template #icon><IconMdiPlay /></template>
        {{ t('lesson.flow.play') }}
      </a-button>
    </div>

    <template v-if="done">
      <p
        v-if="!block.demo"
        class="flow-exercise__result"
        :class="isCorrect ? 'flow-exercise__result--ok' : 'flow-exercise__result--bad'"
      >
        <strong>{{ isCorrect ? t('quiz.correct') : t('quiz.wrong') }}</strong>
        {{ block.explanation }}
      </p>
      <p v-else class="flow-exercise__result">{{ block.explanation }}</p>
      <CodeRunner :code="code" :title="t('game.flow.asCode')" />
      <div class="flow-exercise__actions">
        <a-button @click="reset">
          <template #icon><IconMdiRestart /></template>
          {{ block.demo ? t('lesson.flow.replay') : t('quiz.tryAgain') }}
        </a-button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.flow-exercise {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 22px;
  border-left: 5px solid #6d4bc2;
  // FlowBoard colours its trail, dot and decisions with the accent.
  --accent: #6d4bc2;

  &--demo {
    border-left-color: $color-navy;
  }

  &__label {
    @include eyebrow(#6d4bc2);

    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__hint {
    color: $color-body;
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
  }

  &__result {
    font-size: 16px;
    color: $color-body;

    &--ok strong {
      color: $color-green;
    }

    &--bad strong {
      color: $color-red;
    }
  }
}
</style>
