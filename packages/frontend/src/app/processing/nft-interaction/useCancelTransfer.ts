import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

interface IUseCancelTransfer {
  collectionAddress?: string
}

interface ICancelTransfer {
  tokenId?: string
}

export function useCancelTransfer({ collectionAddress }: IUseCancelTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const config = useConfig()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, ICancelTransfer>()
  const { callContract } = useCallContract()

  const cancelTransfer = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('cancel transfer', { tokenId })

    return callContract({ contract, method: 'cancelTransfer' },
      BigInt(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    cancelTransfer,
  }
}
