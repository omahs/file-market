import { makeAutoObservable } from 'mobx'

import { CollectionData } from '../../../swagger/Api'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { CurrentBlockChainStore } from '../CurrentBlockChain/CurrentBlockChainStore'
import { ErrorStore } from '../Error/ErrorStore'

export class PublicCollectionStore implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore
  currentBlockChainStore: CurrentBlockChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: CollectionData = {
    total: 0,
  }

  constructor({ errorStore, currentBlockChainStore }: { errorStore: ErrorStore, currentBlockChainStore: CurrentBlockChainStore }) {
    this.errorStore = errorStore
    this.currentBlockChainStore = currentBlockChainStore

    makeAutoObservable(this, {
      errorStore: false,
      currentBlockChainStore: false,
    })
  }

  setData(data: CollectionData) {
    this.data = data
  }

  private request() {
    storeRequest(
      this,
      this.currentBlockChainStore.api.collections.fullPublicList({ limit: 20 }),
      (data) => this.setData(data),
    )
  }

  activate(): void {
    this.isActivated = true
    this.request()
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request()
  }

  get collectionMintOptions() {
    if (!this.data?.collection) return []

    return [{
      title: this.data.collection?.name ?? '',
      id: this.data.collection?.address ?? '',
    }]
  }
}
