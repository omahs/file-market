import { getContract } from '@wagmi/core'
import { makeAutoObservable } from 'mobx'

import { wagmiClient } from '../../config/web3Modal'
import { CurrentBlockChainStore } from '../../stores/CurrentBlockChain/CurrentBlockChainStore'
import { MultiChainStore } from '../../stores/MultiChain/MultiChainStore'
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
    console.log(this.currentBlockChainStore.configByChainName?.chain.id)

    return this.multiChainStore.getConfigById(this.currentBlockChainStore.configByChainName?.chain.id ?? this.currentBlockChainStore.chainId)
  }

  getCollectionContract(address: string) {
    const config = this.getConfig()
    assertConfig(config)

    return getContract({
      address,
      abi: config.collectionToken.abi,
      signerOrProvider: wagmiClient.provider,
    })
  }

  getAccessTokenContract() {
    const config = this.getConfig()
    assertConfig(config)

    console.log(wagmiClient.provider)

    return getContract({
      address: config.accessToken.address,
      abi: config.accessToken.abi,
      signerOrProvider: wagmiClient.provider,
    })
  }

  getExchangeContract() {
    const config = this.getConfig()
    assertConfig(config)

    return getContract({
      address: config.exchangeToken.address,
      abi: config.exchangeToken.abi,
      signerOrProvider: wagmiClient.provider,
    })
  }
}

export const contractProvider = new ContractProvider()
