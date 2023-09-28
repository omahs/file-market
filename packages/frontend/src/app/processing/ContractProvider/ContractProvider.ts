import { getWalletClient } from '@wagmi/core'
import { makeAutoObservable } from 'mobx'
import { getContract } from 'wagmi/actions'

import { type CurrentBlockChainStore } from '../../stores/CurrentBlockChain/CurrentBlockChainStore'
import { type MultiChainStore } from '../../stores/MultiChain/MultiChainStore'
import { rootStore } from '../../stores/RootStore'
import { assertConfig } from '../utils'

export class ContractProvider {
  currentBlockChainStore: CurrentBlockChainStore
  multiChainStore: MultiChainStore

  constructor() {
    this.currentBlockChainStore = rootStore.currentBlockChainStore
    this.multiChainStore = rootStore.multiChainStore
    makeAutoObservable(this, {
      multiChainStore: false,
    })
  }

  private getConfig() {
    return this.multiChainStore.getConfigById(
      this.currentBlockChainStore.configByChainName?.chain.id ??
      this.currentBlockChainStore.chainId)
  }

  getCollectionContract(address: `0x${string}`) {
    const config = this.getConfig()
    assertConfig(config)

    const walletClient = getWalletClient()

    return getContract<typeof config.collectionToken.abi, typeof walletClient>({
      address,
      abi: config.collectionToken.abi,
      walletClient: getWalletClient(),
    })
  }

  getAccessTokenContract() {
    const config = this.getConfig()
    assertConfig(config)

    return getContract({
      address: config.accessToken.address,
      abi: config.accessToken.abi,
      walletClient: getWalletClient(),
    })
  }

  getExchangeContract() {
    const config = this.getConfig()
    assertConfig(config)

    return getContract({
      address: config.exchangeToken.address,
      abi: config.exchangeToken.abi,
      walletClient: getWalletClient(),
    })
  }
}

export const contractProvider = new ContractProvider()
