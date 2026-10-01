<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="container games">
    <h1>{{ t('nav.games') }}</h1>
    <GamesByTrack />
  </div>
</template>

<style scoped lang="scss">
.games {
  padding-top: 40px;

  h1 {
    font-size: 40px;
    margin-bottom: 24px;
  }
}
</style>
