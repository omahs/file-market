import { makeAutoObservable } from 'mobx'

import { type ERC721TokenMeta } from '../../processing/types'
import { ipfsService } from '../../services/IPFSService'
import {
  type IActivateDeactivate,
  type IStoreRequester,
  type RequestContext,
  storeRequestFetch,
  storeReset,
} from '../../utils/store'
import { type ErrorStore } from '../Error/ErrorStore'

export class TokenMetaStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  requestCount = 0
  currentRequest?: RequestContext

  isActivated = false
  isLoading = false
  isLoaded = false

  metaURI?: string = undefined

  meta?: ERC721TokenMeta = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  request(metaURI: string) {
    storeRequestFetch(
      this,
      ipfsService.fetchText(metaURI),
      data => {
        this.meta = JSON.parse(data)
      },
    )
  }

  activate(metaURI: string) {
    this.metaURI = metaURI
    this.isActivated = true
    this.request(this.metaURI)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }
}
