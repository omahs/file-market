import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'

interface IUseFinalizeTransfer {
  collectionAddress?: `0x${string}`
}

interface IFinalizeTransfer {
  tokenId?: string
}

export function useFinalizeTransfer({ collectionAddress }: IUseFinalizeTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IFinalizeTransfer>()
  const config = useConfig()

  const finalizeTransfer = useCallback(wrapPromise(async ({ tokenId }: IFinalizeTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('finalize transfer', { tokenId })

    return callContract({ contract, method: 'finalizeTransfer', params: { gasPrice: config?.gasPrice } },
      BigInt(tokenId),
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    finalizeTransfer,
  }
}
