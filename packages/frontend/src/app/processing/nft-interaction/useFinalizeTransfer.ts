import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

interface IUseFinalizeTransfer {
  collectionAddress?: string
}

interface IFinalizeTransfer {
  tokenId?: string
}

export function useFinalizeTransfer({ collectionAddress }: IUseFinalizeTransfer = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IFinalizeTransfer>()
  const config = useConfig()

  const finalizeTransfer = useCallback(wrapPromise(async ({ tokenId }: IFinalizeTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('finalize transfer', { tokenId })

    return callContract({ contract, method: 'finalizeTransfer' },
      BigNumber.from(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    finalizeTransfer,
  }
}
