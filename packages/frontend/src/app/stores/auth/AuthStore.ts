import { makeAutoObservable } from 'mobx'

import { DialogStore } from '../Dialog/DialogStore'
import { ProfileStore } from '../Profile/ProfileStore'

export class AuthStore {
  isLoading: boolean
  address?: `0x${string}`
  dialogStore: DialogStore
  dateStore: DateStore
  isFirstConnect: boolean
  profileStore: ProfileStore
  constructor(rootStore: { dialogStore: DialogStore }) {
    this.isLoading = false
    this.isFirstConnect = true
    makeAutoObservable(this)
    this.authService = new Auth<unknown>({ baseUrl: '/api' })
    this.dialogStore = rootStore.dialogStore
    this.dateStore = new DateStore()
    this.playerStore = rootStore.playerStore
  }

  setData(response: HttpResponse<AuthResponse, ErrorResponse>) {
    assert(response.data.player, 'player is undefined')
    localStorage.setItem('Access_token', response.data.access_token?.token ?? '')
    cookie.remove('access-token')
    cookie.set('access-token', response.data.access_token?.token ?? '', {
      path: '/',
    })
    localStorage.setItem('Refresh_token', response.data.refresh_token?.token ?? '')
    localStorage.setItem('Refresh_tokenExpired', response.data.refresh_token?.expires_at.toString() ?? '0')
    localStorage.setItem('Access_tokenExpired', response.data.access_token?.expires_at.toString() ?? '0')
    this.setUser(response.data.player)
  }

  setUser(user: Player) {
    this.playerStore.setPlayer(user)
  }

  setAddress(address: `0x${string}`) {
    this.address = address
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  async getMessageForAuth (address: `0x${string}`) {
    return await this.authService.messageCreate({ address })
  }

  async loginBySignature({ address, signature }: AuthBySignatureRequest) {
    try {
      const response = await this.authService.bySignatureCreate({ address, signature })
      this.setData(response)
      rootStore.socketStore.createConnection(makeWsUrl('/ws'))
      this.isFirstConnect = false
    } catch (e: any) {
      this.dialogStore.showError(errorToUserText(e))
    }
  }

  async logout() {
    try {
      await this.authService.logoutCreate({
        headers: { authorization: createRefreshToken() },
      })
      localStorage.removeItem('Access_token')
      localStorage.removeItem('Refresh_token')
      localStorage.removeItem('Refresh_tokenExpired')
      localStorage.removeItem('Access_tokenExpired')
      rootStore.socketStore.disconnect()
      this.playerStore.logout()
    } catch (e: any) {
      this.dialogStore.showError(errorToUserText(e.error.message))
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      const response = await this.authService.byTokenCreate({
        headers: { authorization: this.AccessToken },
      })
      assert(response.data.player, 'player is undefined')
      this.setUser(response.data.player)
      rootStore.socketStore.createConnection(makeWsUrl('/ws'))
      this.isFirstConnect = false
    } catch (e: any) {
      console.log(e)
      this.dialogStore.showError(errorToUserText(e.error))
    } finally {
      this.setLoading(false)
    }
  }

  async refreshToken() {
    if (this.isLoading) return
    this.setLoading(true)
    try {
      const response = await this.authService.refreshCreate({
        headers: { authorization: `Bearer ${localStorage.getItem('Refresh_token') ?? ''}` },
      })
      this.setData(response)
      if (this.isFirstConnect) {
        rootStore.socketStore.createConnection(makeWsUrl('/ws'))
        this.isFirstConnect = false
      }
    } catch (e: any) {
      this.dialogStore.showError(errorToUserText(e.error.message))
    } finally {
      this.setLoading(false)
    }
  }

  get isHaveToken() {
    return !!localStorage.getItem('Access_token')
  }

  get isAuth() {
    return !!this.playerStore?.player
  }

  get isActualRefreshToken() {
    return this.expiredRefresh - 40 > 0
  }

  get isActualAccessToken() {
    return this.expiredAccess - 20 > 0
  }

  get expiredAccess(): number {
    return parseInt(localStorage.getItem('Access_tokenExpired') ?? '0') - this.dateStore.nowTime / 1000
  }

  get expiredRefresh(): number {
    return parseInt(localStorage.getItem('Refresh_tokenExpired') ?? '0') - this.dateStore.nowTime / 1000
  }

  get AccessToken() {
    return `Bearer ${localStorage.getItem('Access_token') ?? ''}`
  }

  get RefreshToken() {
    return `Bearer ${localStorage.getItem('Refresh_token') ?? ''}`
  }
}
