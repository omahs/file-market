import {
  LOCALSTORAGE_ACCESS_EXPIRED_KEY,
  LOCALSTORAGE_ACCESS_TOKEN_KEY, LOCALSTORAGE_REFRESH_EXPIRED_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
} from './types'

export const removeAccessToken = () => {
  localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_KEY)
  localStorage.removeItem(LOCALSTORAGE_ACCESS_EXPIRED_KEY)
}
export const removeRefreshToken = () => {
  localStorage.removeItem(LOCALSTORAGE_REFRESH_TOKEN_KEY)
  localStorage.removeItem(LOCALSTORAGE_REFRESH_EXPIRED_KEY)
}
