import { getContract } from '@wagmi/core'
import { makeAutoObservable } from 'mobx'

import { CurrentBlockChainStore } from '../../stores/CurrentBlockChain/CurrentBlockChainStore'
import { MultiChainStore } from '../../stores/MultiChain/MultiChainStore'
import { rootStore } from '../../stores/RootStore'
import { assertConfig } from '../utils'
import { getWalletClient } from '@wagmi/core'

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
    console.log(this.currentBlockChainStore.configByChainName?.chain.id)

    return this.multiChainStore.getConfigById(this.currentBlockChainStore.configByChainName?.chain.id ?? this.currentBlockChainStore.chainId)
  }

  getCollectionContract(address: `0x${string}`) {
    const config = this.getConfig()
    assertConfig(config)

    return getContract({
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
