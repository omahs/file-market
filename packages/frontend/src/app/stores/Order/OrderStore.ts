import { makeAutoObservable } from 'mobx'

import { Order } from '../../../swagger/Api'
import { TokenFullId } from '../../processing/types'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { CurrentBlockChainStore } from '../CurrentBlockChain/CurrentBlockChainStore'
import { ErrorStore } from '../Error/ErrorStore'

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class OrderStore implements IStoreRequester,
  IActivateDeactivate<[string, string]> {
  errorStore: ErrorStore
  currentBlockChainStore: CurrentBlockChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: Order = undefined
  tokenFullId?: TokenFullId = undefined

  constructor({ errorStore, currentBlockChainStore }: { errorStore: ErrorStore, currentBlockChainStore: CurrentBlockChainStore }) {
    this.errorStore = errorStore
    this.currentBlockChainStore = currentBlockChainStore
    makeAutoObservable(this, {
      errorStore: false,
      currentBlockChainStore: false,
    })
  }

  private request(tokenFullId: TokenFullId) {
    storeRequest<Order | null>(
      this,
      this.currentBlockChainStore.api.orders.ordersDetail2(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
      resp => {
        console.log(resp)
        resp && (this.data = resp)
      })
  }

  activate(collectionAddress: string, tokenId: string): void {
    this.isActivated = true
    this.tokenFullId = { collectionAddress, tokenId }
    this.request(this.tokenFullId)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    if (this.tokenFullId) {
      this.request(this.tokenFullId)
    }
  }

  setDataPrice = (price: string, priceUsd: string) => {
    if (this.data) {
      this.data.price = price
      this.data.priceUsd = priceUsd
    } else {
      this.data = {
        price,
        priceUsd,
      }
    }
  }
}
