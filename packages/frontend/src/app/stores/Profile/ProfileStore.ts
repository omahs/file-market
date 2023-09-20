import { makeAutoObservable } from 'mobx'

import { Api, UserProfile } from '../../../swagger/Api'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { RootStore } from '../RootStore'

export class ProfileStore implements IStoreRequester,
  IActivateDeactivate<[string]> {
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

  private request(address: string) {
    storeRequest<UserProfile | null>(
      this,
      this.profileService.profileDetail(address),
      resp => {
        this.user = resp
      })
  }

  activate(address: string): void {
    this.isActivated = true
    this.address = address
    this.request(address)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    if (this.address) {
      this.request(this.address)
    }
  }
}
