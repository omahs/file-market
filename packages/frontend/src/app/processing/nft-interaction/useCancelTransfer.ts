import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

interface IUseCancelTransfer {
  collectionAddress?: string
}

interface ICancelTransfer {
  tokenId?: string
}

export function useCancelTransfer({ collectionAddress }: IUseCancelTransfer = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const config = useConfig()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, ICancelTransfer>()

  const cancelTransfer = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('cancel transfer', { tokenId })

    return callContract({ contract, method: 'cancelTransfer' },
      BigNumber.from(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    cancelTransfer,
  }
}
