import { makeAutoObservable } from 'mobx'

import { Api, UserProfile } from '../../../swagger/Api'
import { createToken } from '../../utils/jwt/createToken'
import { getAccessToken } from '../../utils/jwt/get'
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
    console.log({
      ...this.user,
      ...user,
    })
    if (!user) return
    storeRequest(
      this,
      this.profileService.updateCreate({
        ...this.user,
        ...user,
      }, {
        headers: { authorization: createToken(getAccessToken()?.token ?? '') },
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
      this.profileService.setEmailCreate({ email }, {
        headers: { authorization: createToken(getAccessToken()?.token ?? '') },
      }),
      () => {},
    )
  }
}
