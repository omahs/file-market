import assert from 'assert'
import { ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useExchangeContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import {
  assertAccount, assertCollection,
  assertContract,
  assertSigner,
  assertTokenId,
  bufferToEtherHex,
} from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

/**
 * Fulfills an existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price an integer price
 */

interface IFulFillOrder {
  price?: bigint
  collectionAddress?: string
  tokenId?: string
  signature?: string
}

export function useFulfillOrder() {
  const { contract } = useExchangeContract()
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt, IFulFillOrder>()
  const factory = useHiddenFileProcessorFactory()
  const config = useConfig()

  const { callContract } = useCallContract()

  const fulfillOrder = useCallback(wrapPromise(async ({ collectionAddress, tokenId, price, signature }) => {
    assertCollection(collectionAddress)
    assertContract(contract, config?.exchangeToken.name ?? '')
    assertTokenId(tokenId)
    assertAccount(address)
    assert(price, 'price is not provided')

    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const publicKey = await buyer.initBuy()
    console.log('fulfill order', { collectionAddress, publicKey, tokenId, price })

    return callContract(
      { contract, method: 'fulfillOrder', minBalance: BigInt(price) },
      utils.getAddress(collectionAddress),
      bufferToEtherHex(publicKey),
      BigInt(tokenId),
      signature ? `0x${signature}` : '0x00',
      {
        value: BigInt(price),
        gasPrice: config?.gasPrice,
      },
    )
  }), [contract, address, wrapPromise])

  return { ...statuses, fulfillOrder }
}
