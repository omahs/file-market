import { utils } from 'ethers'
import { makeAutoObservable } from 'mobx'

import multichainConfig from '../../../../../../config/multiChainConfig.json'
import fileBunniesCollection from '../../../abi/FileBunniesCollection'
import collectionToken from '../../../abi/FilemarketCollectionV2'
import exchangeToken from '../../../abi/FilemarketExchangeV2'
import accessToken from '../../../abi/Mark3dAccessTokenV2'
import { Api } from '../../../swagger/Api'
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
    const multiChains: IMultiChainConfig[] = multichainConfig as IMultiChainConfig[]
    this.data = multiChains?.filter((item) => (item.chain.testnet === true) === !import.meta.env.VITE_IS_MAINNET)
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  private request() {
    const multiChains: IMultiChainConfig[] = multichainConfig as IMultiChainConfig[]
    this.data = multiChains?.filter((item) => (item.chain.testnet === true) === !import.meta.env.VITE_IS_MAINNET)
  }

  private readonly getChainFromConfigById = (chainId: number | undefined): IMultiChainConfig => {
    console.log(multichainConfig)
    const defaultChain = (multichainConfig as IMultiChainConfig[]).find(item => item.chain.testnet === !import.meta.env.VITE_IS_MAINNET && item.isDefault) as IMultiChainConfig
    if (chainId === undefined) return defaultChain

    return (multichainConfig as IMultiChainConfig[]).find(item => item.chain.id === chainId) ?? defaultChain
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

    console.log(chainName)
    console.log(this.data)

    return this.data?.find(item => item.chain?.name === chainName)
  }

  getApiByName(chainName: string | undefined): Api<{}> | undefined {
    if (chainName === undefined) return

    return new Api({ baseUrl: this.getChainByName(chainName)?.baseUrl })
  }

  getConfigById (chainId: number | undefined) {
    const chain = this.getChainFromConfigById(chainId)

    return {
      chain: chain.chain,
      // Hardcode high gas price in testnet to prevent "transaction underpriced" error
      gasPrice: !import.meta.env.VITE_IS_MAINNET ? utils.parseUnits('30', 'gwei') : undefined,
      accessToken: {
        address: chain.accessTokenAddress,
        abi: accessToken.abi,
        name: accessToken.contractName,
      },
      exchangeToken: {
        address: chain.exchangeTokenAddress,
        abi: exchangeToken.abi,
        name: exchangeToken.contractName,
      },
      collectionToken: {
      // address is created when a new collection is minted
        abi: collectionToken.abi,
        name: collectionToken.contractName,
      },
      fileBunniesCollectionToken: {
        abi: fileBunniesCollection.abi,
        name: fileBunniesCollection.contractName,
        address: '0xBc3a4453Dd52D3820EaB1498c4673C694c5c6F09',
      },
    }
  }
}
