<script setup lang="ts">
import type { CaseStudyBlock } from '@/models/lesson.model'

defineProps<{ study: CaseStudyBlock }>()

const rows = [
  { key: 'problem', label: 'Problem' },
  { key: 'data', label: 'Data' },
  { key: 'method', label: 'Method' },
  { key: 'outcome', label: 'Outcome' }
] as const
</script>

<template>
  <article class="case">
    <header class="case__head">
      <IconMdiEarth class="case__icon" />
      <div>
        <p class="case__label">Real-world case · {{ study.domain }}</p>
        <h3 class="case__title">{{ study.title }}</h3>
      </div>
    </header>
    <dl class="case__grid">
      <div v-for="row in rows" :key="row.key" class="case__cell">
        <dt>{{ row.label }}</dt>
        <dd>{{ study[row.key] }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped lang="scss">
.case {
  @include card;

  padding: 20px 22px;
  border-left: 5px solid $color-green;

  &__head {
    display: flex;
    gap: 14px;
    align-items: center;
  }

  &__icon {
    flex: none;
    width: 34px;
    height: 34px;
    color: $color-green;
  }

  &__label {
    @include eyebrow($color-green);
  }

  &__title {
    font-size: 20px;
    margin-top: 2px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin: 16px 0 0;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__cell {
    padding: 12px 14px;
    border-radius: $radius-sm;
    background: $color-paper;

    dt {
      @include eyebrow($color-muted);

      font-size: 11px;
    }

    dd {
      margin: 4px 0 0;
      color: $color-ink;
      line-height: 1.5;
    }
  }
}
</style>
