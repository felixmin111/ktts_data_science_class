/** Formats ISO timestamps in the active UI language. */
export function useDateFormat() {
  const { locale } = useI18n()
  const formatter = computed(
    () => new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'short' })
  )
  return (iso: string | null | undefined) => (iso ? formatter.value.format(new Date(iso)) : '—')
}
