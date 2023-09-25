import { makeAutoObservable } from 'mobx'

import { type WhitelistResponse } from '../../../swagger/Api'
import { type IActivateDeactivate, type IStoreRequester, type RequestContext, storeRequest, storeReset } from '../../utils/store'
import { type CurrentBlockChainStore } from '../CurrentBlockChain/CurrentBlockChainStore'
import { type ErrorStore } from '../Error/ErrorStore'

/**
 * Stores whitelist state
 * Does not listen for updates, need to reload manually.
 */

export class WhiteListStore implements IStoreRequester,
  IActivateDeactivate<[`0x${string}`]> {
  errorStore: ErrorStore
  currentBlockChainStore: CurrentBlockChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: WhitelistResponse = undefined
  address?: `0x${string}` = undefined

  constructor({ errorStore, currentBlockChainStore }: { errorStore: ErrorStore, currentBlockChainStore: CurrentBlockChainStore }) {
    this.errorStore = errorStore
    this.currentBlockChainStore = currentBlockChainStore

    makeAutoObservable(this, {
      errorStore: false,
      currentBlockChainStore: false,
    })
  }

  private request(address: `0x${string}`) {
    storeRequest<WhitelistResponse>(
      this,
      this.currentBlockChainStore.api.collections.fileBunniesWhitelistDetail(address),
      resp => {
        this.data = resp
      })
  }

  activate(address: `0x${string}`): void {
    this.isActivated = true
    this.address = address
    this.request(this.address)
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
