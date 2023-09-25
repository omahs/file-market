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
  collectionAddress?: `0x${string}`
}

interface IApproveExchange {
  tokenId?: string
}

export function useApproveExchange({ collectionAddress }: IUseApproveExchange = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const config = useConfig()
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IApproveExchange>()
  const approveExchange = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, 'Mark3dCollection')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    console.log('approve exchange', 'exchange contract address', config?.exchangeToken.address, 'tokenId', tokenId)

    return callContract<typeof contract.abi>({ contract, method: 'approve', params: { gasPrice: config?.gasPrice } },
      config?.exchangeToken.address,
      BigInt(tokenId),
    )
  }), [wrapPromise, contract])

  return {
    ...statuses,
    approveExchange,
  }
}
