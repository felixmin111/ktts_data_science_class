<script setup lang="ts">
import type { QuizBlock } from '@/models/lesson.model'

const props = defineProps<{ quiz: QuizBlock }>()
const { t } = useI18n()

const chosen = ref<number | null>(null)
const checked = ref(false)
const isCorrect = computed(() => chosen.value === props.quiz.answer)

function retry() {
  chosen.value = null
  checked.value = false
}
</script>

<template>
  <div class="quiz">
    <p class="quiz__label"><IconMdiHelpCircleOutline /> Quick check</p>
    <p class="quiz__question">{{ quiz.question }}</p>
    <CodeRunner v-if="quiz.code" :code="quiz.code" />

    <div class="quiz__options">
      <button
        v-for="(option, index) in quiz.options"
        :key="option"
        type="button"
        class="quiz__option"
        :class="{
          'quiz__option--chosen': chosen === index,
          'quiz__option--right': checked && index === quiz.answer,
          'quiz__option--wrong': checked && chosen === index && !isCorrect
        }"
        :disabled="checked"
        @click="chosen = index"
      >
        <code>{{ option }}</code>
      </button>
    </div>

    <div class="quiz__footer">
      <a-button v-if="!checked" type="primary" :disabled="chosen === null" @click="checked = true">
        {{ t('quiz.check') }}
      </a-button>
      <template v-else>
        <p :class="isCorrect ? 'quiz__result--ok' : 'quiz__result--bad'">
          <strong>{{ isCorrect ? t('quiz.correct') : t('quiz.wrong') }}</strong>
          {{ quiz.explanation }}
        </p>
        <a-button v-if="!isCorrect" @click="retry">{{ t('quiz.tryAgain') }}</a-button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quiz {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 22px;
  border-left: 5px solid $color-blue;

  &__label {
    @include eyebrow;

    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__question {
    font-size: 18px;
    font-weight: 600;
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
  }

  &__option {
    padding: 12px 14px;
    text-align: left;
    border: 2px solid $color-line;
    border-radius: $radius-sm;
    background: #fff;
    cursor: pointer;
    transition: border-color 120ms;

    code {
      background: none;
      padding: 0;
      white-space: pre-wrap;
    }

    &:hover:not(:disabled) {
      border-color: $color-blue;
    }

    &:disabled {
      cursor: default;
    }

    &--chosen {
      border-color: $color-blue;
      background: rgba($color-blue, 0.06);
    }

    &--right {
      border-color: $color-green;
      background: rgba($color-green, 0.1);
    }

    &--wrong {
      border-color: $color-red;
      background: rgba($color-red, 0.08);
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__result--ok {
    color: $color-green;
  }

  &__result--bad {
    color: $color-red;
  }
}
</style>
