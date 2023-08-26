import { makeAutoObservable } from 'mobx'

import { Api, UserProfile } from '../../../swagger/Api'
import { IStoreRequester, RequestContext, storeRequest } from '../../utils/store'
import { AuthStore } from '../auth/AuthStore'
import { ErrorStore } from '../Error/ErrorStore'
import { RootStore } from '../RootStore'

export class UserStore implements IStoreRequester {
  user?: UserProfile | null
  authStore?: AuthStore
  profileService: Api<{}>['profile']
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  address?: string

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.profileService = new Api<{}>({ baseUrl: '/api' }).profile
    this.errorStore = rootStore.errorStore
    this.authStore = rootStore.authStore
  }

  setUser(user?: UserProfile) {
    this.user = user
  }

  logout() {
    this.user = undefined
  }

  async updateUserInfo(user?: UserProfile) {
    console.log({
      ...this.user,
      ...user,
    })
    if (!user || !this.authStore) return
    storeRequest(
      this,
      this.profileService.updateCreate({
        ...this.user,
        ...user,
      }, {
        headers: { authorization: this.authStore?.AccessToken },
      }),
      (response) => {
        this.setUser(response)
      },
    )
  }

  async updateEmail(email?: string) {
    if (!email || !this.authStore) return
    storeRequest(
      this,
      this.profileService.setEmailCreate({ email }, {
        headers: { authorization: this.authStore?.AccessToken },
      }),
      () => {},
    )
  }
}
