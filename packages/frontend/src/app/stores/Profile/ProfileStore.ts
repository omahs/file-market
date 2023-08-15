import { makeAutoObservable } from 'mobx'

import { Api, UserProfile } from '../../../swagger/Api'
import { stringifyError } from '../../utils/error'
import { ErrorStore } from '../Error/ErrorStore'
import { RootStore } from '../RootStore'

export class ProfileStore {
  user?: UserProfile
  profileService: Api<{}>['profile']
  errorStore: ErrorStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.profileService = new Api<{}>({ baseUrl: '/api' }).profile
    this.errorStore = rootStore.errorStore
  }

  setUser(user?: UserProfile) {
    this.user = user
  }

  logout() {
    this.user = undefined
  }

  updateProfileInfo(user?: UserProfile) {
    if (!user) return
    this.profileService.updateCreate(user)
      .then((resp) => {
        this.setUser(resp.data)
      })
      .catch((e) => {
        this.errorStore.showError(stringifyError(e))
      })
  }
}
