import assert from 'assert'
import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { ZeroAddress } from '../../utils/constants'
import { assertCollection, assertConfig, assertTokenId } from '../utils'

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
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt | undefined, IPlaceOrder>()
  const config = useConfig()
  const { callContract } = useCallContract()

  const placeOrder = useCallback(wrapPromise(async ({ collectionAddress, tokenId, price }: IPlaceOrder) => {
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assertConfig(config)
    assert(price, 'price is not provided')
    console.log('place order', { collectionAddress, tokenId, price })

    return callContract(
      {
        callContractConfig: {
          address: config.exchangeToken.address,
          abi: config.exchangeToken.abi,
          functionName: 'placeOrder',
          gasPrice: config?.gasPrice,
          args: [collectionAddress as `0x${string}`,
            BigInt(tokenId),
            BigInt(price),
            ZeroAddress],
        },
      })
  }), [config, wrapPromise])

  return {
    ...statuses,
    placeOrder,
  }
}
