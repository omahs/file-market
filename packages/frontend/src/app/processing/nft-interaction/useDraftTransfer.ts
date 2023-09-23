import {ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, nullAddress } from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

interface IDraftTransfer {
  collectionAddress?: string
  tokenId?: string
}

export function useDraftTransfer() {
  const { contract } = useCollectionContract()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IDraftTransfer>()
  const config = useConfig()
  const { callContract } = useCallContract()
  const draftTransfer = useCallback(wrapPromise(async ({ collectionAddress, tokenId }: IDraftTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('draft transfer', { tokenId, callbackReceiver: nullAddress })

    return callContract({ contract, method: 'draftTransfer' },
      BigInt(tokenId),
      nullAddress,
      { gasPrice: config?.gasPrice },
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    draftTransfer,
  }
}
