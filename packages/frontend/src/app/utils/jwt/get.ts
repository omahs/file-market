import { type JwtTokenInfo } from '../../../swagger/Api'
import {
  LOCALSTORAGE_ACCESS_EXPIRED_KEY,
  LOCALSTORAGE_ACCESS_TOKEN_KEY,
  LOCALSTORAGE_REFRESH_EXPIRED_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
} from './types'

export const getAccessToken = (): JwtTokenInfo | undefined => {
  const token = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_KEY)
  const expiresAt = localStorage.getItem(LOCALSTORAGE_ACCESS_EXPIRED_KEY)

  if (!(token && expiresAt)) return undefined

  return {
    token,
    expires_at: +expiresAt,
  }
}
export const getRefreshToken = (): JwtTokenInfo | undefined => {
  const token = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY)
  const expiresAt = localStorage.getItem(LOCALSTORAGE_REFRESH_EXPIRED_KEY)

  if (!(token && expiresAt)) return undefined

  return {
    token,
    expires_at: +expiresAt,
  }
}
