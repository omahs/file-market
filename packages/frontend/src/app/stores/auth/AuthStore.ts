import Cookies from 'js-cookie'
import { makeAutoObservable } from 'mobx'

import {
  Api,
  AuthBySignatureRequest,
  AuthResponse,
  ErrorResponse,
  HttpResponse,
  UserProfile,
} from '../../../swagger/Api'
import { stringifyError } from '../../utils/error'
import { DateStore } from '../Date/DateStore'
import { DialogStore } from '../Dialog/DialogStore'
import { ErrorStore } from '../Error/ErrorStore'
import { ProfileStore } from '../Profile/ProfileStore'

export class AuthStore {
  isLoading: boolean
  address?: `0x${string}`
  dialogStore: DialogStore
  errorStore: ErrorStore
  dateStore: DateStore
  isFirstConnect: boolean
  profileStore: ProfileStore
  authService: Api<{}>
  constructor(rootStore: { dialogStore: DialogStore, profileStore: ProfileStore, dateStore: DateStore, errorStore: ErrorStore }) {
    this.isLoading = false
    this.isFirstConnect = true
    this.authService = new Api<{}>({ baseUrl: '/api' })
    makeAutoObservable(this)
    this.dialogStore = rootStore.dialogStore
    this.dateStore = rootStore.dateStore
    this.profileStore = rootStore.profileStore
    this.errorStore = rootStore.errorStore
  }

  setData(response: HttpResponse<AuthResponse, ErrorResponse>) {
    localStorage.setItem('Access_token', response.data.access_token?.token ?? '')
    Cookies.remove('access-token')
    Cookies.set('access-token', response.data.access_token?.token ?? '', {
      path: '/',
    })
    localStorage.setItem('Refresh_token', response.data.refresh_token?.token ?? '')
    localStorage.setItem('Refresh_tokenExpired', response.data.refresh_token?.expires_at.toString() ?? '0')
    localStorage.setItem('Access_tokenExpired', response.data.access_token?.expires_at.toString() ?? '0')
    this.setUser({
      name: 'Aleshka',
    })
  }

  setUser(user?: UserProfile) {
    this.profileStore.setUser(user)
  }

  setAddress(address: `0x${string}`) {
    this.address = address
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  async getMessageForAuth (address: `0x${string}`) {
    return this.authService.auth.messageCreate({ address })
  }

  async loginBySignature({ address, signature }: AuthBySignatureRequest) {
    try {
      const response = await this.authService.auth.bySignatureCreate({ address, signature })
      this.setData(response)
      this.isFirstConnect = false
    } catch (e: any) {
      this.errorStore.showError(stringifyError(e))
    }
  }

  async logout() {
    try {
      await this.authService.auth.logoutCreate({
        headers: { authorization: this.RefreshToken },
      })
      localStorage.removeItem('Access_token')
      localStorage.removeItem('Refresh_token')
      localStorage.removeItem('Refresh_tokenExpired')
      localStorage.removeItem('Access_tokenExpired')
      this.profileStore.logout()
    } catch (e: any) {
      this.errorStore.showError(stringifyError(e.error.message))
      localStorage.removeItem('Access_token')
      localStorage.removeItem('Refresh_token')
      localStorage.removeItem('Refresh_tokenExpired')
      localStorage.removeItem('Access_tokenExpired')
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      // const response = await this.authService.auth.byTokenCreate({
      //   headers: { authorization: this.AccessToken },
      // })
      // this.setUser(response.data.player)
      console.log('Connect by jwt')
      this.isFirstConnect = false
    } catch (e: any) {
      console.log(e)
      this.errorStore.showError(stringifyError(e.error))
    } finally {
      this.setLoading(false)
    }
  }

  async refreshToken() {
    if (this.isLoading) return
    this.setLoading(true)
    try {
      const response = await this.authService.auth.refreshCreate({
        headers: { authorization: this.RefreshToken },
      })
      this.setData(response)
      if (this.isFirstConnect) {
        this.isFirstConnect = false
      }
    } catch (e: any) {
      this.errorStore.showError(stringifyError(e.error.message))
      this.logout()
    } finally {
      this.setLoading(false)
    }
  }

  get isHaveToken() {
    return !!localStorage.getItem('Access_token')
  }

  get isAuth() {
    return !!this.profileStore?.user
  }

  get isActualRefreshToken() {
    return this.expiredRefresh - 40 > 0
  }

  get isActualAccessToken() {
    return this.expiredAccess - 20 > 0
  }

  get expiredAccess(): number {
    console.log('Access')
    console.log(parseInt(localStorage.getItem('Access_tokenExpired') ?? '0') - this.dateStore.nowTime)

    return parseInt(localStorage.getItem('Access_tokenExpired') ?? '0') - this.dateStore.nowTime
  }

  get expiredRefresh(): number {
    console.log('Refresh')
    console.log(parseInt(localStorage.getItem('Refresh_tokenExpired') ?? '0') - this.dateStore.nowTime)

    return parseInt(localStorage.getItem('Refresh_tokenExpired') ?? '0') - this.dateStore.nowTime
  }

  get AccessToken() {
    return `Bearer ${localStorage.getItem('Access_token') ?? ''}`
  }

  get RefreshToken() {
    return `Bearer ${localStorage.getItem('Refresh_token') ?? ''}`
  }
}
