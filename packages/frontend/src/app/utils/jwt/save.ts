import { type JwtTokenInfo } from '../../../swagger/Api'
import {
  LOCALSTORAGE_ACCESS_EXPIRED_KEY,
  LOCALSTORAGE_ACCESS_TOKEN_KEY,
  LOCALSTORAGE_REFRESH_EXPIRED_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
} from './types'

export const saveAccessToken = (jwt?: JwtTokenInfo) => {
  if (!jwt) return
  localStorage.setItem(LOCALSTORAGE_ACCESS_TOKEN_KEY, jwt.token)
  localStorage.setItem(LOCALSTORAGE_ACCESS_EXPIRED_KEY, jwt.expires_at.toString())
}
export const saveRefreshToken = (jwt?: JwtTokenInfo) => {
  if (!jwt) return
  localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, jwt.token)
  localStorage.setItem(LOCALSTORAGE_REFRESH_EXPIRED_KEY, jwt.expires_at.toString())
}
