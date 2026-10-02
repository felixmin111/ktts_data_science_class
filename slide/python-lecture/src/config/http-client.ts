import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import env from './env'
import { EndpointUri } from '@/constant/endpointUri'
import type { ApiErrorCode } from '@/models/auth.model'

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  retried?: boolean
}

const httpClient = axios.create({
  baseURL: env.apiBaseURI,
  timeout: env.apiTimeout,
  // Sends the httpOnly refresh cookie; X-Requested-With is the API's CSRF check for cookie endpoints.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

const AUTH_ENDPOINTS: string[] = [
  EndpointUri.LOGIN,
  EndpointUri.REGISTER,
  EndpointUri.REFRESH,
  EndpointUri.LOGOUT
]

httpClient.interceptors.request.use((config) => {
  const auth = useAuthStore()
  const localeStore = useLocaleStore()

  if (localeStore.locale) {
    config.headers['Accept-Language'] = localeStore.locale
  }
  if (auth.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`)
  }
  return config
})

/** On 401 the access token has expired: refresh once (shared by parallel requests) and retry. */
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableRequestConfig | undefined
    const isAuthCall = AUTH_ENDPOINTS.some((uri) => config?.url?.endsWith(uri))

    if (error.response?.status === 401 && config && !config.retried && !isAuthCall) {
      config.retried = true
      const auth = useAuthStore()
      if (await auth.refresh()) {
        return httpClient(config)
      }
      auth.expireSession()
    }
    return Promise.reject(error)
  }
)

const KNOWN_ERROR_CODES = new Set<ApiErrorCode>([
  'VALIDATION_FAILED',
  'WEAK_PASSWORD',
  'EMAIL_TAKEN',
  'INVALID_CREDENTIALS',
  'ACCOUNT_LOCKED',
  'INVALID_REFRESH_TOKEN',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'RATE_LIMITED',
  'INTERNAL_ERROR'
])

/** The API's error code for a failed request, for showing `t('errors.<code>')`. */
export function apiErrorCode(error: unknown): ApiErrorCode {
  if (!axios.isAxiosError(error)) return 'INTERNAL_ERROR'
  if (!error.response) return 'NETWORK_ERROR'

  const code = (error.response.data as { code?: unknown } | undefined)?.code
  if (typeof code === 'string' && KNOWN_ERROR_CODES.has(code as ApiErrorCode)) {
    return code as ApiErrorCode
  }
  // No code from our API: a proxy or gateway answered because the account server is down or
  // unreachable (the Vite dev proxy answers 500 with an empty body when it cannot connect).
  return error.response.status >= 500 ? 'SERVER_UNAVAILABLE' : 'INTERNAL_ERROR'
}

export default httpClient
