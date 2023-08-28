import { makeAutoObservable } from 'mobx'

import { Api, UserProfile } from '../../../swagger/Api'
import { requestJwtAccess } from '../../utils/jwt/function'
import { IStoreRequester, RequestContext, storeRequest } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { RootStore } from '../RootStore'

export class UserStore implements IStoreRequester {
  user?: UserProfile | null
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
  }

  setUser(user?: UserProfile) {
    this.user = user
    console.log(user)
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
      () => {},
    )
  }
}
