import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useExchangeContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

/**
 * Calls Mark3dExchange contract to cancel an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */

interface ICancelOrder {
  collectionAddress?: string
  tokenId?: string
}

export function useCancelOrder() {
  const { contract } = useExchangeContract()
  const { callContract } = useCallContract()
  const config = useConfig()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt, ICancelOrder>()
  const cancelOrder = useCallback(wrapPromise(async ({ collectionAddress, tokenId }) => {
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assertContract(contract, config?.exchangeToken.name ?? '')
    console.log('cancel order', { collectionAddress, tokenId })

    return callContract({ contract, method: 'cancelOrder' },
      collectionAddress,
      BigInt(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    cancelOrder,
  }
}
