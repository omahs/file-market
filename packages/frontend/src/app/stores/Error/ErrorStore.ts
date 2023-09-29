import { makeAutoObservable } from 'mobx'
import { type ReactNode } from 'react'

import { type DialogStore } from '../Dialog/DialogStore'

export class ErrorStore {
  dialogStore: DialogStore

  constructor({ dialogStore }: { dialogStore: DialogStore }) {
    this.dialogStore = dialogStore
    makeAutoObservable(this, {
      dialogStore: false,
    })
  }

  // в основном error: string, но технически можно что угодно пихнуть
  showError = (error: ReactNode) => {
    this.dialogStore.showError(error)
  }
}
