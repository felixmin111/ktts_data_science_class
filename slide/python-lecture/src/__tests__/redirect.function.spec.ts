import { describe, expect, it } from 'vitest'
import { safeRedirect } from '@/functions/redirect.function'

describe('safeRedirect', () => {
  it('keeps paths on this site', () => {
    expect(safeRedirect({ redirect: '/lessons/day-1/variables' })).toBe('/lessons/day-1/variables')
  })

  it('falls back to home for other sites and odd values', () => {
    expect(safeRedirect({ redirect: 'https://evil.example' })).toBe('/')
    expect(safeRedirect({ redirect: '//evil.example/path' })).toBe('/')
    expect(safeRedirect({ redirect: ['/a', '/b'] })).toBe('/')
    expect(safeRedirect({})).toBe('/')
  })
})
