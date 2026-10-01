<script setup lang="ts">
import Routes from '@/router/uri.route'

const { t } = useI18n()
</script>

<template>
  <div class="container">
    <a-result status="404" :title="t('notFound.title')" :sub-title="t('notFound.body')">
      <template #extra>
        <RouterLink :to="{ name: Routes.HOME.name }">
          <a-button type="primary">{{ t('notFound.home') }}</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>
