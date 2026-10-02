<script setup lang="ts">
import { renderInline } from '@/functions/highlight.function'

defineProps<{ tone: 'info' | 'warning' | 'success'; title: string; body: string }>()
</script>

<template>
  <a-alert class="callout" :type="tone" show-icon :message="title">
    <template #description>
      <!-- eslint-disable-next-line vue/no-v-html -- renderInline escapes all text -->
      <span v-html="renderInline(body)" />
    </template>
  </a-alert>
</template>

<style scoped lang="scss">
.callout {
  border-radius: $radius;

  :deep(.ant-alert-message) {
    font-weight: 600;
  }
}
</style>
