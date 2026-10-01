<script setup lang="ts">
defineProps<{ tone: 'info' | 'warning' | 'success'; title: string; body: string }>()
</script>

<template>
  <a-alert class="callout" :type="tone" show-icon :message="title" :description="body" />
</template>

<style scoped lang="scss">
.callout {
  border-radius: $radius;

  :deep(.ant-alert-message) {
    font-weight: 600;
  }
}
</style>
