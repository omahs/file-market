import { makeAutoObservable } from 'mobx'

import { Transfer, TransfersResponse } from '../../../swagger/Api'
import { stringifyTokenFullId } from '../../processing/utils/id'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { CurrentBlockChainStore } from '../CurrentBlockChain/CurrentBlockChainStore'
import { ErrorStore } from '../Error/ErrorStore'

export class TransferListStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore
  currentBlockChainStore: CurrentBlockChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  incoming: Transfer[] = []
  outgoing: Transfer[] = []
  address = ''

  constructor({ errorStore, currentBlockChainStore }: { errorStore: ErrorStore, currentBlockChainStore: CurrentBlockChainStore }) {
    this.errorStore = errorStore
    this.currentBlockChainStore = currentBlockChainStore
    makeAutoObservable(this, {
      errorStore: false,
      currentBlockChainStore: false,
    })
  }

  // key - stringifyTokenFullId({collectionAddress, tokenId})
  get fullIdDict(): Record<string, Transfer> {
    const dict: Record<string, Transfer> = Object.create(null)
    const fillDict = (list: Transfer[]) => {
      list.forEach(transfer => {
        if (transfer.collection && transfer.tokenId) {
          dict[stringifyTokenFullId({ collectionAddress: transfer.collection, tokenId: transfer.tokenId })] = transfer
        }
      })
    }
    fillDict(this.incoming)
    fillDict(this.outgoing)

    return dict
  }

  private request(address: string) {
    storeRequest<TransfersResponse>(
      this,
      this.currentBlockChainStore.api.transfers.transfersDetail(address),
      data => {
        if (data.incoming) {
          this.incoming = data.incoming
        }
        if (data.outgoing) {
          this.outgoing = data.outgoing
        }
      },
    )
  }

  reset() {
    storeReset(this)
  }

  activate(address: string): void {
    this.isActivated = true
    this.address = address
    this.request(address)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reload(): void {
    this.request(this.address)
  }
}
