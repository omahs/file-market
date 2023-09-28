import assert from 'assert'
import { useCallback } from 'react'
import { getAddress, type TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useExchangeContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import {
  assertAccount, assertCollection,
  assertContract,
  assertTokenId,
  bufferToEtherHex,
} from '../utils'

/**
 * Fulfills an existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price an integer price
 */

interface IFulFillOrder {
  price?: string
  collectionAddress?: string
  tokenId?: string
  signature?: string
}

export function useFulfillOrder() {
  const { contract } = useExchangeContract()
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt, IFulFillOrder>()
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
      {
        callContractConfig: {
          address: contract.address,
          abi: contract.abi,
          functionName: 'fulfillOrder',
          value: BigInt(price),
          gasPrice: config?.gasPrice,
          args: [getAddress(collectionAddress),
            bufferToEtherHex(publicKey),
            BigInt(tokenId),
            signature ? `0x${signature}` : '0x00'],
        },
        minBalance: BigInt(price),
      },
    )
  }), [contract, address, wrapPromise])

  return { ...statuses, fulfillOrder }
}
