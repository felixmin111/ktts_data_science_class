import en from './locales/en'
import my from './locales/my'

export enum Locale {
  EN = 'en',
  MY = 'my'
}

const i18n = createI18n({
  legacy: false,
  locale: Locale.EN,
  fallbackLocale: Locale.EN,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    [Locale.EN]: en,
    [Locale.MY]: my
  }
})

export default i18n
