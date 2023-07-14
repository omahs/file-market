import { makeAutoObservable } from 'mobx'

import { CollectionsResponse } from '../../../swagger/Api'
import { api } from '../../config/api'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset,
} from '../../utils/store'
import { lastItem } from '../../utils/structs'
import { ErrorStore } from '../Error/ErrorStore'

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class CollectionListStore implements IStoreRequester, IActivateDeactivate {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = true
  isActivated = false

  data: CollectionsResponse = {
    total: 0,
  }

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  setData(data: CollectionsResponse) {
    this.data = data
  }

  addData(data: CollectionsResponse) {
    if (!this.data.collections) {
      this.data.collections = []
    }
    this.data.collections.push(...(data?.collections ?? []))
    this.data.total = data.total
  }

  private request() {
    storeRequest(
      this,
      api.collections.collectionsList({ limit: 20 }),
      (data) => this.setData(data),
    )
  }

  requestMore() {
    const lastCollectionAddress = lastItem(this.data.collections ?? [])?.address
    storeRequest(
      this,
      api.collections.collectionsList({ lastCollectionAddress, limit: 20 }),
      (data) => this.addData(data),
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

  get hasMoreData() {
    const { total = 0, collections = [] } = this.data

    return collections.length < total
  }
}
