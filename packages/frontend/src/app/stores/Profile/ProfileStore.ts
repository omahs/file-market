import { makeAutoObservable } from 'mobx'

import { Gloves, Player } from '../../../apiClient/data-contracts'
import { Profile } from '../../../apiClient/Profile'
import { errorToUserText } from '../../utils'
import { DialogStore } from '../dialog/DialogStore'
import { rootStore } from '../RootStore'

export class ProfileStore {
  player?: Player
  profileService: Profile
  dialogStore: DialogStore
  constructor(rootStore: { dialogStore: DialogStore }) {
    makeAutoObservable(this)
    this.profileService = new Profile({ baseUrl: '/api' })
    this.dialogStore = rootStore.dialogStore
  }

  setPhone = async (value: string) => {
    this.player && (this.player.phone = value)
  }

  setName = async (value: string) => {
    this.player && (this.player.name = value)
  }

  setAvatar = async (value: string) => {
    this.player && (this.player.avatar_link = value)
  }

  setGloves = async (value: Gloves) => {
    await this.profileService.updateCreate({ default_gloves_id: value.id, name: this.player?.name }, { headers: { Authorization: rootStore.authStore.AccessToken } })
      .then(() => {
        this.player && (this.player.default_gloves = value)
      })
      .catch((e) => {
        this.dialogStore.showError(errorToUserText(e))
      })
  }

  setPlayer = (player: Player) => {
    this.player = player
  }

  logout = () => {
    this.player = undefined
  }

  setAllUnreadMessage = (value: number) => {
    if (this.player !== undefined) {
      if (value < 0) {
        this.player.unread_messages_count = 0
      } else {
        this.player.unread_messages_count = value
      }
    }
  }
}
