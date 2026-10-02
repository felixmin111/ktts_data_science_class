<script setup lang="ts">
defineProps<{ title?: string }>()

const { t } = useI18n()
const revealed = ref(false)
</script>

<template>
  <div v-if="!revealed" class="solution-cover">
    <p class="solution-cover__title"><IconMdiEyeOffOutline /> {{ title }}</p>
    <p class="solution-cover__hint">{{ t('lesson.solution.hint') }}</p>
    <a-button type="primary" @click="revealed = true">
      <template #icon><IconMdiEyeOutline /></template>
      {{ t('lesson.solution.show') }}
    </a-button>
  </div>
  <div v-else class="solution">
    <slot />
    <a-button class="solution__hide" type="link" size="small" @click="revealed = false">
      <template #icon><IconMdiEyeOffOutline /></template>
      {{ t('lesson.solution.hide') }}
    </a-button>
  </div>
</template>

<style scoped lang="scss">
.solution-cover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 20px 22px;
  border: 2px dashed $color-line;
  border-radius: $radius;

  &__title {
    @include eyebrow;

    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__hint {
    color: $color-body;
  }
}

.solution {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  > :first-child {
    align-self: stretch;
  }
}
</style>
