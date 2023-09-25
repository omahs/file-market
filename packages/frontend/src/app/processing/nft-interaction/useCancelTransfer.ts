import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'

interface IUseCancelTransfer {
  collectionAddress?: `0x${string}`
}

interface ICancelTransfer {
  tokenId?: string
}

export function useCancelTransfer({ collectionAddress }: IUseCancelTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const config = useConfig()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, ICancelTransfer>()
  const { callContract } = useCallContract()

  const cancelTransfer = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('cancel transfer', { tokenId })

    return callContract({ contract, method: 'cancelTransfer', params: { gasPrice: config?.gasPrice } },
      BigInt(tokenId),
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    cancelTransfer,
  }
}
