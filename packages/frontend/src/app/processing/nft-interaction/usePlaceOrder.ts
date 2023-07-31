import assert from 'assert'
import { BigNumber, BigNumberish, constants, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useExchangeContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId } from '../utils'
import { callContract } from '../utils/error'

interface IPlaceOrder {
  collectionAddress?: string
  tokenId?: string
  price?: BigNumberish
  callBack?: () => void
}

/**
 * Calls Mark3dExchange contract to place an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */

export function usePlaceOrder() {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt | undefined, IPlaceOrder>()
  const config = useConfig()

  const placeOrder = useCallback(wrapPromise(async ({ collectionAddress, tokenId, price }: IPlaceOrder) => {
    assertContract(contract, config?.exchangeToken.name ?? '')
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(price, 'price is not provided')
    console.log('place order', { collectionAddress, tokenId, price })

    return callContract({ contract, method: 'placeOrder' },
      collectionAddress,
      BigNumber.from(tokenId),
      BigNumber.from(price),
      constants.AddressZero,
      { gasPrice: config?.gasPrice },
    )
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    placeOrder,
  }
}
