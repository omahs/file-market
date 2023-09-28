import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'

interface IUseFinalizeTransfer {
  collectionAddress?: string
}

interface IFinalizeTransfer {
  tokenId?: string
}

export function useFinalizeTransfer({ collectionAddress }: IUseFinalizeTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress as `0x${string}`)
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IFinalizeTransfer>()
  const config = useConfig()

  const finalizeTransfer = useCallback(wrapPromise(async ({ tokenId }: IFinalizeTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('finalize transfer', { tokenId })

    return callContract(
      {
        callContractConfig: {
          address: contract.address,
          abi: contract.abi,
          functionName: 'finalizeTransfer',
          gasPrice: config?.gasPrice,
          args: [BigInt(tokenId)],
        },
      },
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    finalizeTransfer,
  }
}
