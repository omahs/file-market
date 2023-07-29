import { makeAutoObservable } from 'mobx'

import { Api } from '../../../swagger/Api'
import multichainConfig from '../../config/multiChainConfig.json'
import { IMultiChainConfig } from '../../config/multiChainConfigType'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeReset,
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class MultiChainStore implements IStoreRequester, IActivateDeactivate {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = true
  isActivated = false

  data?: IMultiChainConfig[]

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  private request() {
    const multiChains: IMultiChainConfig[] = JSON.parse(JSON.stringify(multichainConfig))
    // @ts-expect-error
    this.data = multiChains?.filter((item) => (item.chain.testnet === 'true') === !import.meta.env.VITE_IS_MAINNET)
    // @ts-expect-error
    console.log(multiChains?.filter((item) => (item.chain.testnet === 'true') === !import.meta.env.VITE_IS_MAINNET))
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

  getChainById(chainId: number | undefined): IMultiChainConfig | undefined {
    if (chainId === undefined) return

    return this.data?.find(item => item.chain?.id === chainId)
  }

  getChainByName(chainName: string | undefined): IMultiChainConfig | undefined {
    if (chainName === undefined) return

    return this.data?.find(item => item.chain?.name === chainName)
  }

  getApiByName(chainName: string | undefined): Api<{}> | undefined {
    if (chainName === undefined) return

    return new Api({ baseUrl: this.getChainByName(chainName)?.baseUrl })
  }
}
