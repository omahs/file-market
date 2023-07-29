import { getContract, Provider } from '@wagmi/core'

import { getConfigById } from '../../config/mark3d'
import { wagmiClient } from '../../config/web3Modal'
import { rootStore } from '../../stores/RootStore'
import { assertConfig } from '../utils'

export class ContractProvider {
  constructor(
    private readonly provider: Provider,
  ) {}

  getCollectionContract(address: string) {
    const config = getConfigById(rootStore.currentBlockChainStore.chainId)
    assertConfig(config)

    return getContract({
      address,
      abi: config.collectionToken.abi,
      signerOrProvider: this.provider,
    })
  }

  getAccessTokenContract() {
    const config = getConfigById(rootStore.currentBlockChainStore.chainId)
    assertConfig(config)

    console.log(config)

    return getContract({
      address: config.accessToken.address,
      abi: config.accessToken.abi,
      signerOrProvider: this.provider,
    })
  }

  getExchangeContract() {
    const config = getConfigById(rootStore.currentBlockChainStore.chainId)
    assertConfig(config)

    return getContract({
      address: config.exchangeToken.address,
      abi: config.exchangeToken.abi,
      signerOrProvider: this.provider,
    })
  }
}

export const contractProvider = new ContractProvider(wagmiClient.provider)
