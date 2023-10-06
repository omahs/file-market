import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { assertCollection, assertConfig, assertTokenId } from '../utils'

/**
 * Used to approve Mark3dExchange contract to manage user's NFT. Should be called prior to placeOrder.
 * @param collectionAddress
 * @param tokenId
 */

interface IApproveExchange {
  tokenId?: string
  collectionAddress?: string
}

export function useApproveExchange() {
  const config = useConfig()
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IApproveExchange>()
  const approveExchange = useCallback(wrapPromise(async ({ tokenId, collectionAddress }) => {
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assertConfig(config)

    return callContract({
      callContractConfig: {
        address: collectionAddress as `0x${string}`,
        abi: config.collectionToken.abi,
        functionName: 'approve',
        gasPrice: config?.gasPrice,
        args: [config?.exchangeToken.address,
          BigInt(tokenId)],
      },
    },
    )
  }), [wrapPromise, config])

  return {
    ...statuses,
    approveExchange,
  }
}
