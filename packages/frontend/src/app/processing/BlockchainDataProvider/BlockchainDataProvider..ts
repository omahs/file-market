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

    console.log()

    const globalSalt = await callContractGetter<typeof contract.abi, `0x${string}`>({ contract, method: 'globalSalt' })

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

    const transferCountBN = await callContractGetter<typeof contract.abi, bigint>(
      { contract, method: 'transferCounts' },
      BigInt(tokenId),
    )

    return transferCountBN
  }

  async getFee() {
    const contract = this.contractProvider.getExchangeContract()

    return callContractGetter<typeof contract.abi, bigint>({ contract, method: 'fee' })
  }

  async getRoyaltyAmount(collectionAddress: ArrayBuffer, tokenId: number, price: bigint) {
    const contract = this.contractProvider.getCollectionContract(bufferToEtherHex(collectionAddress))

    const { royaltyAmount } = await callContractGetter<typeof contract.abi, { royaltyAmount: bigint }>(
      { contract, method: 'royaltyInfo' },
      BigInt(tokenId),
      price,
    )

    return royaltyAmount
  }
}

/**
 * Exists as singleton
 */
export const blockchainDataProvider = new BlockchainDataProvider(contractProvider)
