import { makeAutoObservable } from 'mobx'

import { UserProfile } from '../../../swagger/Api'

export class ProfileStore {
  user?: UserProfile
  constructor() {
    makeAutoObservable(this)
  }

  setPlayer(user?: UserProfile) {
    this.user = user
  }
}
