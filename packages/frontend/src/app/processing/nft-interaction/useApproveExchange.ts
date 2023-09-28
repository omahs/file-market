import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'

/**
 * Used to approve Mark3dExchange contract to manage user's NFT. Should be called prior to placeOrder.
 * @param collectionAddress
 * @param tokenId
 */

interface IUseApproveExchange {
  collectionAddress?: string
}

interface IApproveExchange {
  tokenId?: string
}

export function useApproveExchange({ collectionAddress }: IUseApproveExchange = {}) {
  const { contract } = useCollectionContract(collectionAddress as `0x${string}`)
  const config = useConfig()
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IApproveExchange>()
  const approveExchange = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, 'Mark3dCollection')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    return callContract({
      callContractConfig: {
        address: contract.address,
        abi: contract.abi,
        functionName: 'approve',
        gasPrice: config?.gasPrice,
        args: [config?.exchangeToken.address,
          BigInt(tokenId)],
      },
    },
    )
  }), [wrapPromise, contract])

  return {
    ...statuses,
    approveExchange,
  }
}
