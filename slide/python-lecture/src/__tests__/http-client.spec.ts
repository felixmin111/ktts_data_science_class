import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { apiErrorCode } from '@/config/http-client'

function failed(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() }
  const response = { status, data, headers: {}, statusText: '', config } as AxiosResponse
  return new AxiosError('failed', undefined, config, undefined, response)
}

describe('apiErrorCode', () => {
  it('passes through codes sent by our API', () => {
    expect(apiErrorCode(failed(409, { code: 'EMAIL_TAKEN' }))).toBe('EMAIL_TAKEN')
  })

  it('reports an unreachable server when a proxy answers without our error body', () => {
    expect(apiErrorCode(failed(500, ''))).toBe('SERVER_UNAVAILABLE')
    expect(apiErrorCode(failed(502, '<html>Bad Gateway</html>'))).toBe('SERVER_UNAVAILABLE')
  })

  it('does not show codes from other servers', () => {
    expect(apiErrorCode(failed(500, { code: 'MSG500' }))).toBe('SERVER_UNAVAILABLE')
    expect(apiErrorCode(failed(404, { code: 'MSG404' }))).toBe('INTERNAL_ERROR')
  })

  it('reports network failures', () => {
    expect(apiErrorCode(new AxiosError('offline'))).toBe('NETWORK_ERROR')
  })
})
