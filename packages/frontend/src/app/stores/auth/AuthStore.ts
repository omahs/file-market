import Cookies from 'js-cookie'
import { makeAutoObservable } from 'mobx'

import {
  Api,
  AuthBySignatureRequest,
  AuthResponse,
  UserProfile,
} from '../../../swagger/Api'
import { getAccessToken, getRefreshToken } from '../../utils/jwt/get'
import { removeAccessToken, removeRefreshToken } from '../../utils/jwt/remove'
import { saveAccessToken, saveRefreshToken } from '../../utils/jwt/save'
import { IStoreRequester, RequestContext, storeRequest } from '../../utils/store'
import { DateStore } from '../Date/DateStore'
import { DialogStore } from '../Dialog/DialogStore'
import { ErrorStore } from '../Error/ErrorStore'
import { UserStore } from '../User/UserStore'

const TIME_BEFORE_EXPIRED_ACCESS = 20000
const TIME_BEFORE_EXPIRED_REFRESH = 40000

export class AuthStore implements IStoreRequester {
  errorStore: ErrorStore
  isLoaded = false
  isLoading = false
  currentRequest?: RequestContext
  requestCount = 0
  dialogStore: DialogStore
  dateStore: DateStore
  userStore: UserStore
  authService: Api<{}>

  isAuth?: boolean
  isTryAuth?: boolean

  constructor(rootStore: { dialogStore: DialogStore, userStore: UserStore, dateStore: DateStore, errorStore: ErrorStore }) {
    this.authService = new Api<{}>({ baseUrl: '/api' })
    makeAutoObservable(this)
    this.dialogStore = rootStore.dialogStore
    this.dateStore = rootStore.dateStore
    this.errorStore = rootStore.errorStore
    this.userStore = rootStore.userStore
  }

  setData(response: AuthResponse) {
    saveAccessToken(response.access_token)
    saveRefreshToken(response.refresh_token)
    Cookies.remove('access-token')
    console.log('CHECK1')
    Cookies.set('access-token', response.access_token?.token ?? '', {
      path: '/',
    })
    this.setUser(response.profile)
    console.log('CHECK2')
    this.isAuth = true
    console.log('SET AUTH TRUE')
  }

  setUser(user?: UserProfile) {
    this.userStore?.setUser(user)
  }

  async getMessageForAuth (address: `0x${string}`) {
    return this.authService.auth.messageCreate({ address })
  }

  async loginBySignature({ address, signature }: AuthBySignatureRequest) {
    storeRequest(
      this,
      this.authService.auth.bySignatureCreate({ address, signature }),
      (response) => {
        console.log('PPPPPPPPPPPPPPPPPPPPPPPP')
        this.setData(response)
      },
    )
  }

  async logout() {
    console.log('LOGOUT1')
    storeRequest(
      this,
      this.authService.auth.logoutCreate({
        headers: { authorization: this.AccessToken },
      }),
      () => {},
    )
    removeAccessToken()
    removeRefreshToken()
    this.userStore.logout()
    this.isAuth = false
    console.log('SET AUTH FALSE')
  }

  async checkAuth() {
    storeRequest(
      this,
      this.authService.auth.checkAuthList({
        headers: { authorization: this.AccessToken },
      }),
      (response) => {
        this.setUser(response)
        this.isAuth = true
        console.log('SET AUTH TRUE')
      },
      () => {
        this.logout()
        this.isAuth = false
        console.log('SET AUTH FALSE')
      },
    )
  }

  async refreshToken() {
    storeRequest(
      this,
      this.authService.auth.refreshCreate({
        headers: { authorization: this.RefreshToken },
      }),
      (response) => {
        this.setData(response)
      },
      () => {
        this.logout()
      },
    )
  }

  get isHaveToken() {
    return !!getAccessToken()
  }

  get isActualRefreshToken() {
    return this.expiredRefresh - TIME_BEFORE_EXPIRED_REFRESH > 0
  }

  get isActualAccessToken() {
    return this.expiredAccess - TIME_BEFORE_EXPIRED_ACCESS > 0
  }

  private get expiredAccess(): number {
    // console.log('Access')
    // console.log(parseInt(localStorage.getItem('Access_tokenExpired') ?? '0') - this.dateStore.nowTime)

    return parseInt(getAccessToken()?.expires_at.toString() ?? '0') - this.dateStore.nowTime
  }

  private get expiredRefresh(): number {
    // console.log('Refresh')
    // console.log(parseInt(localStorage.getItem('Refresh_tokenExpired') ?? '0') - this.dateStore.nowTime)

    return parseInt(getRefreshToken()?.expires_at.toString() ?? '0') - this.dateStore.nowTime
  }

  get AccessToken() {
    return `Bearer ${getAccessToken()?.token ?? ''}`
  }

  get RefreshToken() {
    return `Bearer ${getRefreshToken()?.token ?? ''}`
  }
}
