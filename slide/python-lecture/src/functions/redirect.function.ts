import type { LocationQuery } from 'vue-router'

/** The `?redirect=` target if it is a path on this site, so a crafted link cannot send users elsewhere. */
export function safeRedirect(query: LocationQuery): string {
  const redirect = query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/'
}
