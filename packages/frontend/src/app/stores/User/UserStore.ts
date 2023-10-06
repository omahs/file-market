import { makeAutoObservable } from 'mobx'

import { Api, type UserProfile } from '../../../swagger/Api'
import { requestJwtAccess } from '../../utils/jwt/function'
import { type IStoreRequester, type RequestContext, storeRequest } from '../../utils/store'
import { type DateStore } from '../Date/DateStore'
import { type ErrorStore } from '../Error/ErrorStore'
import { type RootStore } from '../RootStore'

const TIMER_EMAIL_KEY = 'TimerEmail'
const TIME_DISABLE_RESEND = 60000

export class UserStore implements IStoreRequester {
  user?: UserProfile | null
  profileService: Api<unknown>['profile']
  errorStore: ErrorStore
  dateStore: DateStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  address?: string

  timeCanResend: number

  constructor(rootStore: RootStore) {
    this.timeCanResend = +(localStorage.getItem(TIMER_EMAIL_KEY) ?? '0')
    makeAutoObservable(this)
    this.profileService = new Api<unknown>({ baseUrl: '/api' }).profile
    this.errorStore = rootStore.errorStore
    this.dateStore = rootStore.dateStore
  }

  setUser(user?: UserProfile) {
    this.user = user
    console.log(user)
  }

  setTimeCanResend(time: number) {
    this.timeCanResend = time + TIME_DISABLE_RESEND
    localStorage.setItem(TIMER_EMAIL_KEY, (time + TIME_DISABLE_RESEND).toString())
  }

  logout() {
    this.user = undefined
  }

  async updateUserInfo(user?: UserProfile) {
    if (!user) return
    storeRequest(
      this,
      requestJwtAccess(this.profileService.updateCreate, {
        ...this.user,
        ...user,
      }),
      (response) => {
        this.setUser(response)
      },
    )
  }

  async updateEmail(email?: string) {
    if (!email) return
    storeRequest(
      this,
      requestJwtAccess(this.profileService.setEmailCreate, { email }),
      () => {
        this.setUser({
          ...this.user,
          email,
          isEmailConfirmed: false,
        })
        this.setTimeCanResend(Date.now())
      },
    )
  }

  get timeToCanResend() {
    return this.timeCanResend - this.dateStore.now
  }
}
