import assert from 'assert'
import { BigNumber, BigNumberish, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useExchangeContract } from '../contracts'
import { TokenFullId } from '../types'
import { assertCollection, assertContract, assertSigner, assertTokenId } from '../utils'

/**
 * Calls Mark3dExchange contract to place an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */
export function usePlaceOrder({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, price?: BigNumberish) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const placeOrder = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(price, 'price is not provided')
    console.log('place order', { collectionAddress, tokenId, price })

    const tx = await contract.placeOrder(
      collectionAddress as `0x${string}`,
      BigNumber.from(tokenId),
      BigNumber.from(price),
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, wrapPromise, collectionAddress, tokenId, price])
  return {
    ...statuses,
    placeOrder
  }
}
