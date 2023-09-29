import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { assertCollection, assertConfig, assertTokenId } from '../utils'

interface ICancelTransfer {
  tokenId?: string
  collectionAddress?: string
}

export function useCancelTransfer() {
  const config = useConfig()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, ICancelTransfer>()
  const { callContract } = useCallContract()

  const cancelTransfer = useCallback(wrapPromise(async ({ tokenId, collectionAddress }) => {
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assertConfig(config)
    console.log('cancel transfer', { tokenId })

    return callContract(
      {
        callContractConfig: {
          address: collectionAddress as `0x${string}`,
          abi: config.collectionToken.abi,
          functionName: 'cancelTransfer',
          gasPrice: config?.gasPrice,
          args: [BigInt(tokenId)],
        },
      },
    )
  }), [config, wrapPromise])

  return {
    ...statuses,
    cancelTransfer,
  }
}
