/** Keeps document.title in sync with the current route's i18n title. */
export function useDocumentTitle() {
  const route = useRoute()
  const { t } = useI18n()
  watchEffect(() => {
    const page = route.meta.title ? t(route.meta.title) : ''
    document.title = page ? `${page} · ${t('app.name')}` : t('app.name')
  })
}
