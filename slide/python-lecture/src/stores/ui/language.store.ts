import { computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage, type RemovableRef } from '@vueuse/core'

import enUS from 'ant-design-vue/es/locale/en_US'

import i18n, { Locale } from '@/i18n'

// Ant Design Vue ships no Burmese locale, so its built-in texts stay in English.
const antdLocales = {
  [Locale.EN]: enUS,
  [Locale.MY]: enUS
} as const

export const useLocaleStore = defineStore('locale', () => {
  const locale = useStorage('lang', Locale.EN) as RemovableRef<Locale>

  const antdLocale = computed(() => antdLocales[locale.value] ?? enUS)

  function apply(lang: Locale) {
    i18n.global.locale.value = lang
    document.documentElement.lang = lang
  }

  function initialize() {
    if (!Object.values(Locale).includes(locale.value)) locale.value = Locale.EN
    apply(locale.value)
  }

  function setLocale(lang: Locale) {
    if (locale.value === lang) return

    locale.value = lang
    apply(lang)
  }

  return {
    locale,
    antdLocale,
    setLocale,
    initialize
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot))
}
