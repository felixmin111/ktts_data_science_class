<script setup lang="ts">
defineProps<{ title: string; body: string }>()
const { t } = useI18n()
</script>

<template>
  <aside class="analogy">
    <IconMdiLightbulbOnOutline class="analogy__icon" />
    <div>
      <p class="analogy__label">{{ t('lesson.analogy', { title }) }}</p>
      <p class="analogy__body">{{ body }}</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.analogy {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 18px 22px;
  background: $color-tint;
  border-radius: $radius;

  &__icon {
    flex: none;
    width: 30px;
    height: 30px;
    color: $color-amber-ink;
  }

  &__label {
    @include eyebrow($color-amber-ink);
  }

  &__body {
    margin-top: 4px;
    font-size: 17px;
    color: $color-ink;
  }
}
</style>
