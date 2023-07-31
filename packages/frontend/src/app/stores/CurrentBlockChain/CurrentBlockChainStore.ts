import { Chain } from '@web3modal/ethereum'
import { makeAutoObservable } from 'mobx'

import { Api } from '../../../swagger/Api'
import { IMultiChainConfig } from '../../config/multiChainConfigType'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeReset,
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { MultiChainStore } from '../MultiChain/MultiChainStore'

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class CurrentBlockChainStore implements IStoreRequester, IActivateDeactivate<[IMultiChainConfig[]]> {
  errorStore: ErrorStore
  multiChainStore: MultiChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = true
  isActivated = false

  chainId?: number
  chainNameByPage?: string

  constructor({ errorStore, multiChainStore }: { errorStore: ErrorStore, multiChainStore: MultiChainStore }) {
    this.errorStore = errorStore
    this.multiChainStore = multiChainStore
    makeAutoObservable(this, {
      errorStore: false,
      multiChainStore: false,
    })
  }

  setCurrentBlockChain(chainId: number) {
    if (chainId !== this.chainId) this.chainId = chainId
  }

  setCurrentBlockChainByPage(chainName: string | undefined) {
    if (chainName !== this.chainNameByPage) this.chainNameByPage = chainName
  }

  private request(data: IMultiChainConfig[] | undefined) {
    const defaultChain = data?.find(item => (item.isDefault === true))
    this.chainId = defaultChain ? defaultChain.chain.id : data?.[0].chain.id
  }

  activate(data: IMultiChainConfig[] | undefined): void {
    this.isActivated = true
    this.request(data)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  get baseUrl(): string | undefined {
    const chain = this.multiChainStore.data?.find(item => (item.chain.id === this.chainId))

    return chain?.baseUrl
  }

  get api() {
    return new Api({ baseUrl: this.baseUrl ?? '/api' })
  }

  get chain(): Chain | undefined {
    return this.multiChainStore.data?.find(item => item.chain.id === this.chainId)?.chain
  }

  get configChain(): IMultiChainConfig | undefined {
    return this.multiChainStore.data?.find(item => item.chain.id === this.chainId)
  }

  get configByChainName(): IMultiChainConfig | undefined {
    console.log(this.multiChainStore.data?.find(item => item.chain.name === this.chainNameByPage))

    return this.multiChainStore.data?.find(item => item.chain.name === this.chainNameByPage)
  }
}
