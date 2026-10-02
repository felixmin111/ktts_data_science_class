import type { ContentTranslation } from '@/models/translation.model'
import i18n, { Locale } from '@/i18n'
import myanmar from './locales/my/content'

/** Lesson and game translations per locale. English is the source and needs none. */
export const contentTranslations: Partial<Record<Locale, ContentTranslation>> = {
  [Locale.MY]: myanmar
}

/** Translations for the active locale. Reading it inside a render or computed keeps it reactive. */
export function activeContentTranslation(): ContentTranslation | undefined {
  return contentTranslations[i18n.global.locale.value as Locale]
}
