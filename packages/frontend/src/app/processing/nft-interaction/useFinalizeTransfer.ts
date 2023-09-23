import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

interface IUseFinalizeTransfer {
  collectionAddress?: string
}

interface IFinalizeTransfer {
  tokenId?: string
}

export function useFinalizeTransfer({ collectionAddress }: IUseFinalizeTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IFinalizeTransfer>()
  const config = useConfig()

  const finalizeTransfer = useCallback(wrapPromise(async ({ tokenId }: IFinalizeTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('finalize transfer', { tokenId })

    return callContract({ contract, method: 'finalizeTransfer' },
      BigInt(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    finalizeTransfer,
  }
}
