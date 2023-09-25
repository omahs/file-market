import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId, nullAddress } from '../utils'

interface IDraftTransfer {
  collectionAddress?: string
  tokenId?: string
}

export function useDraftTransfer() {
  const { contract } = useCollectionContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IDraftTransfer>()
  const config = useConfig()
  const { callContract } = useCallContract()
  const draftTransfer = useCallback(wrapPromise(async ({ collectionAddress, tokenId }: IDraftTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('draft transfer', { tokenId, callbackReceiver: nullAddress })

    return callContract({ contract, method: 'draftTransfer', params: { gasPrice: config?.gasPrice } },
      BigInt(tokenId),
      nullAddress,
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    draftTransfer,
  }
}
