import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { assertCollection, assertConfig, assertTokenId } from '../utils'

interface IFinalizeTransfer {
  tokenId?: string
  collectionAddress?: string
}

export function useFinalizeTransfer() {
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IFinalizeTransfer>()
  const config = useConfig()

  const finalizeTransfer = useCallback(wrapPromise(async ({ tokenId, collectionAddress }: IFinalizeTransfer) => {
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assertConfig(collectionAddress)
    console.log('finalize transfer', { tokenId })

    return callContract(
      {
        callContractConfig: {
          address: collectionAddress as `0x${string}`,
          abi: config.collectionToken.abi,
          functionName: 'finalizeTransfer',
          gasPrice: config?.gasPrice,
          args: [BigInt(tokenId)],
        },
      },
    )
  }), [config, wrapPromise])

  return {
    ...statuses,
    finalizeTransfer,
  }
}
