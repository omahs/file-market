import { makeAutoObservable } from 'mobx'

import { type CurrentBlockChainStore } from '../../stores/CurrentBlockChain/CurrentBlockChainStore'
import { rootStore } from '../../stores/RootStore'
import { type ContractProvider, contractProvider } from '../ContractProvider'
import { bufferToEtherHex, callContractGetter, hexToBuffer } from '../utils'
import { type IBlockchainDataProvider } from './IBlockchainDataProvider'

export class BlockchainDataProvider implements IBlockchainDataProvider {
  currentBlockChainStore: CurrentBlockChainStore

  constructor(
    private readonly contractProvider: ContractProvider,
  ) {
    this.currentBlockChainStore = rootStore.currentBlockChainStore
    makeAutoObservable(this)
  }

  private getUrl() {
    return (this.currentBlockChainStore.configByChainName?.baseUrl ?? this.currentBlockChainStore.configChain?.baseUrl) ?? '/api'
  }

  async #stringifyResponse(response: Response) {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message)
    }

    return data
  }

  async getLastTransferInfo(collectionAddress: ArrayBuffer, tokenId: number) {
    const response = await fetch(
      `${this.getUrl()}/tokens/${bufferToEtherHex(collectionAddress)}/${tokenId}/encrypted_password`,
      { method: 'GET' },
    )

    return this.#stringifyResponse(response)
  }

  async getGlobalSalt() {
    const contract = this.contractProvider.getAccessTokenContract()

    const globalSalt = await callContractGetter<typeof contract.abi, 'globalSalt', `0x${string}`>({
      callContractConfig: {
        address: contract.address,
        functionName: 'globalSalt',
        abi: contract.abi,
      },
    })

    console.log('GLOBAL SALT')
    console.log(globalSalt)

    return hexToBuffer(globalSalt)
  }

  async getTokenCreator(collectionAddress: ArrayBuffer, tokenId: number) {
    const response = await fetch(
      `${this.getUrl()}/tokens/${bufferToEtherHex(collectionAddress)}/${tokenId}`,
      { method: 'GET' },
    )

    const data = await this.#stringifyResponse(response)

    return data.creator
  }

  async getTransferCount(collectionAddress: ArrayBuffer, tokenId: number) {
    const contract = this.contractProvider.getCollectionContract(bufferToEtherHex(collectionAddress))

    const transferCountBN = await callContractGetter<typeof contract.abi, 'trasnferCounts'>(
      {
        callContractConfig: {
          address: contract.address,
          functionName: 'transferCounts',
          abi: contract.abi,
          args: [BigInt(tokenId)],
        },
      },

    )

    console.log('TRANSFER COUNT')
    console.log(transferCountBN)

    return transferCountBN
  }

  async getFee() {
    const contract = this.contractProvider.getExchangeContract()

    const data = await callContractGetter<typeof contract.abi, 'fee'>({
      callContractConfig: {
        address: contract.address,
        functionName: 'fee',
        abi: contract.abi,
      },
    })

    console.log('FEE')
    console.log(data)

    return data[1]
  }

  async getRoyaltyAmount(collectionAddress: ArrayBuffer, tokenId: number, price: bigint) {
    const contract = this.contractProvider.getCollectionContract(bufferToEtherHex(collectionAddress))

    const data = await callContractGetter<typeof contract.abi, 'royaltyInfo'>(
      {
        callContractConfig: {
          address: contract.address,
          functionName: 'royaltyInfo',
          abi: contract.abi,
          args: [BigInt(tokenId),
            price],
        },
      },
    )

    console.log('ROYALTY')
    console.log(data)

    return data[1]
  }
}

/**
 * Exists as singleton
 */
export const blockchainDataProvider = new BlockchainDataProvider(contractProvider)
