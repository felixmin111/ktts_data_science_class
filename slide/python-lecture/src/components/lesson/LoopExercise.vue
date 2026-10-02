<script setup lang="ts">
import { loopToPython } from '@/functions/loop.function'
import type { LoopBlock } from '@/models/lesson.model'

const props = defineProps<{ block: LoopBlock }>()
const { t } = useI18n()

const code = computed(() => loopToPython(props.block.program))
const isTrace = computed(() => props.block.mode === 'trace')
const started = ref(false)
const done = ref(false)
const mistakes = ref(0)
/** Bumped on "Start again" so the board remounts fresh. */
const attempt = ref(0)

function again() {
  started.value = false
  done.value = false
  mistakes.value = 0
  attempt.value += 1
}
</script>

<template>
  <div class="loop-exercise" :class="{ 'loop-exercise--trace': isTrace }">
    <p class="loop-exercise__label">
      <IconMdiRefresh />
      {{ block.title ?? (isTrace ? t('lesson.loop.trace') : t('lesson.loop.demo')) }}
    </p>
    <p v-if="!done" class="loop-exercise__hint">
      {{ isTrace ? t('lesson.loop.traceHint') : t('lesson.loop.demoHint') }}
    </p>

    <LoopBoard
      :key="attempt"
      :program="block.program"
      :mode="isTrace ? 'trace' : 'watch'"
      @done="done = true"
      @mistake="mistakes += 1"
    >
      <template
        #controls="{ play, pause, step, restart, playing, finished, asking, fast, toggleFast }"
      >
        <div v-if="!finished && !asking" class="loop-exercise__controls">
          <a-button
            v-if="!playing"
            type="primary"
            @click="
              () => {
                started = true
                play()
              }
            "
          >
            <template #icon><IconMdiPlay /></template>
            {{
              started
                ? t('lesson.loop.resume')
                : isTrace
                  ? t('lesson.loop.startTrace')
                  : t('lesson.loop.play')
            }}
          </a-button>
          <a-button v-else @click="pause()">
            <template #icon><IconMdiPause /></template>
            {{ t('lesson.loop.pause') }}
          </a-button>
          <a-button :disabled="playing" @click="step()">
            <template #icon><IconMdiDebugStepOver /></template>
            {{ t('lesson.loop.step') }}
          </a-button>
          <a-button type="text" @click="toggleFast()">
            {{ fast ? '2×' : '1×' }}
          </a-button>
          <a-button v-if="started" type="text" @click="restart()">
            <template #icon><IconMdiRestart /></template>
          </a-button>
        </div>
      </template>
    </LoopBoard>

    <template v-if="done">
      <p class="loop-exercise__result">
        <strong v-if="isTrace" :class="mistakes ? 'bad' : 'ok'">
          {{
            mistakes
              ? t('lesson.loop.doneWithMistakes', { n: mistakes })
              : t('lesson.loop.donePerfect')
          }}
        </strong>
        {{ block.explanation }}
      </p>
      <CodeRunner :code="code" :title="t('lesson.loop.asCode')" />
      <div>
        <a-button @click="again">
          <template #icon><IconMdiRestart /></template>
          {{ t('lesson.loop.again') }}
        </a-button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.loop-exercise {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 22px;
  border-left: 5px solid $color-navy;
  --accent: #1f7a8c;

  @include mobile {
    padding: 16px;
  }

  &--trace {
    border-left-color: #1f7a8c;
  }

  &__label {
    @include eyebrow(#1f7a8c);

    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__hint {
    color: $color-body;
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__result {
    font-size: 16px;
    color: $color-body;

    .ok {
      color: $color-green;
    }

    .bad {
      color: $color-amber-ink;
    }
  }
}
</style>
