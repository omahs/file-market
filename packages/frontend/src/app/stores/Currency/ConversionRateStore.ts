import { makeAutoObservable } from 'mobx'

import { ConversionRateResponse } from '../../../swagger/Api'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset,
} from '../../utils/store'
import { CurrentBlockChainStore } from '../CurrentBlockChain/CurrentBlockChainStore'
import { ErrorStore } from '../Error/ErrorStore'

export class ConversionRateStore implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore
  currentBlockChainStore: CurrentBlockChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: ConversionRateResponse = undefined

  constructor({ errorStore, currentBlockChainStore }: { errorStore: ErrorStore, currentBlockChainStore: CurrentBlockChainStore }) {
    this.errorStore = errorStore
    this.currentBlockChainStore = currentBlockChainStore
    makeAutoObservable(this, {
      errorStore: false,
      currentBlockChainStore: false,
    })
  }

  setData(data: ConversionRateResponse) {
    this.data = data
  }

  private request() {
    storeRequest(
      this,
      this.currentBlockChainStore.api.currency.conversionRateList(),
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
    this.data = undefined
    storeReset(this)
  }

  reload(): void {
    this.request()
  }
}
