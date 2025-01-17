import { makeAutoObservable } from 'mobx'

import { type Api, type Collection, type CollectionResponse } from '../../../swagger/Api'
import {
  type IActivateDeactivate,
  type IStoreRequester,
  type RequestContext,
  storeRequest,
  storeReset,
} from '../../utils/store'
import { type ErrorStore } from '../Error/ErrorStore'
import { type MultiChainStore } from '../MultiChain/MultiChainStore'

export class CollectionStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore
  multiChainStore: MultiChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  collection?: Collection
  address: string = ''

  api?: Api<unknown>

  isCustomApi: boolean = true

  constructor({ errorStore, multiChainStore }: { errorStore: ErrorStore, multiChainStore: MultiChainStore }) {
    this.errorStore = errorStore
    this.multiChainStore = multiChainStore
    makeAutoObservable(this, {
      errorStore: false,
      multiChainStore: false,
    })
  }

  private request(address: string, api?: Api<unknown>) {
    if (!api) return
    storeRequest<CollectionResponse>(
      this,
      api.collections.collectionsDetail(address),
      (resp) => {
        this.collection = resp.collection
      },
    )
  }

  activate(address: string, chainName?: string): void {
    this.isActivated = true
    this.address = address
    this.api = this.multiChainStore.getApiByName(chainName)
    this.request(address, this.api)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request(this.address, this.api)
  }
}
