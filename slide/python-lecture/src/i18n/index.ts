import en from './locales/en'

export enum Locale {
  EN = 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: Locale.EN,
  fallbackLocale: Locale.EN,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    [Locale.EN]: en
  }
})

export default i18n
