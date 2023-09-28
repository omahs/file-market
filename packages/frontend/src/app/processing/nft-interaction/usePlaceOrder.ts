import assert from 'assert'
import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useExchangeContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'

interface IPlaceOrder {
  collectionAddress?: string
  tokenId?: string
  price?: string
  callBack?: () => void
}

/**
 * Calls Mark3dExchange contract to place an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */

export function usePlaceOrder() {
  const { contract } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt | undefined, IPlaceOrder>()
  const config = useConfig()
  const { callContract } = useCallContract()

  const placeOrder = useCallback(wrapPromise(async ({ collectionAddress, tokenId, price }: IPlaceOrder) => {
    assertContract(contract, config?.exchangeToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(price, 'price is not provided')
    console.log('place order', { collectionAddress, tokenId, price })

    return callContract(
      {
        callContractConfig: {
          address: contract.address,
          abi: contract.abi,
          functionName: 'placeOrder',
          gasPrice: config?.gasPrice,
          args: [collectionAddress,
            BigInt(tokenId),
            BigInt(price),
            '0x0000000000000000000000000000000000000000'],
        },
      })
  }), [contract, wrapPromise])

  return {
    ...statuses,
    placeOrder,
  }
}
