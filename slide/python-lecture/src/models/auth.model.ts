export type Role = 'STUDENT' | 'TEACHER'

export interface User {
  id: string
  email: string
  displayName: string
  role: Role
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  expiresInSeconds: number
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  displayName: string
}

/** Error codes sent by the API; each has a translation under `errors.<code>`. */
export type ApiErrorCode =
  | 'VALIDATION_FAILED'
  | 'WEAK_PASSWORD'
  | 'EMAIL_TAKEN'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'INVALID_REFRESH_TOKEN'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_UNAVAILABLE'
