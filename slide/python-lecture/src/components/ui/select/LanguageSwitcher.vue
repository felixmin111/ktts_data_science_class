<script setup lang="ts">
import { Locale } from '@/i18n'
import type { SelectValue } from 'ant-design-vue/es/select'

const { t } = useI18n()
const localeStore = useLocaleStore()
const { locale } = storeToRefs(localeStore)

const handleChange = (value: Locale | SelectValue) => {
  localeStore.setLocale(value as Locale)
}
</script>

<template>
  <a-select class="language-switcher" :value="locale" size="small" @change="handleChange">
    <template #suffixIcon><IconMdiTranslate /></template>

    <a-select-option :key="Locale.EN" :value="Locale.EN">
      {{ t('locale.english') }}
    </a-select-option>

    <a-select-option :key="Locale.MY" :value="Locale.MY">
      {{ t('locale.myanmar') }}
    </a-select-option>
  </a-select>
</template>

<style scoped lang="scss">
.language-switcher {
  width: 104px;

  :deep(.ant-select-selector) {
    border-radius: 999px !important;
  }
}
</style>
