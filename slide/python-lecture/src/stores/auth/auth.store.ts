import { defineStore, acceptHMRUpdate } from 'pinia'

import httpClient from '@/config/http-client'
import { EndpointUri } from '@/constant/endpointUri'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/models/auth.model'
import router from '@/router'
import Routes from '@/router/uri.route'

/**
 * The access token lives only in memory, never in localStorage, so injected scripts cannot steal a
 * long-lived credential. A page reload restores the session through the httpOnly refresh cookie.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref('')
  const restored = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const isTeacher = computed(() => user.value?.role === 'TEACHER')

  let refreshInFlight: Promise<boolean> | null = null

  function apply(response: AuthResponse) {
    accessToken.value = response.accessToken
    user.value = response.user
  }

  function clear() {
    accessToken.value = ''
    user.value = null
    useProgressStore().clear()
    useScoreStore().clear()
  }

  async function afterSignIn(response: AuthResponse) {
    apply(response)
    await Promise.all([useProgressStore().load(), useScoreStore().load()])
  }

  async function login(request: LoginRequest) {
    const { data } = await httpClient.post<AuthResponse>(EndpointUri.LOGIN, request)
    await afterSignIn(data)
  }

  async function register(request: RegisterRequest) {
    const { data } = await httpClient.post<AuthResponse>(EndpointUri.REGISTER, request)
    await afterSignIn(data)
  }

  /** Swaps the refresh cookie for a new access token. Parallel callers share one request. */
  function refresh(): Promise<boolean> {
    refreshInFlight ??= httpClient
      .post<AuthResponse>(EndpointUri.REFRESH)
      .then(({ data }) => {
        apply(data)
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
      })
    return refreshInFlight
  }

  /** Runs once per page load, before the first route is shown. */
  async function restoreSession() {
    if (restored.value) return
    restored.value = true
    if (await refresh()) {
      await Promise.all([useProgressStore().load(), useScoreStore().load()])
    }
  }

  async function logout() {
    try {
      await httpClient.post(EndpointUri.LOGOUT)
    } finally {
      clear()
      await router.push({ name: Routes.LOGIN.name })
    }
  }

  /** The refresh token is gone or revoked: drop local state and ask the user to sign in again. */
  function expireSession() {
    if (!user.value) return
    clear()
    const current = router.currentRoute.value
    router.push({ name: Routes.LOGIN.name, query: { redirect: current.fullPath, expired: '1' } })
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isTeacher,
    login,
    register,
    refresh,
    restoreSession,
    logout,
    expireSession
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
