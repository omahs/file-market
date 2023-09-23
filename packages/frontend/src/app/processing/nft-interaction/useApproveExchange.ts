import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertTokenId } from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

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
  const { contract } = useCollectionContract(collectionAddress)
  const config = useConfig()
  const { callContract } = useCallContract()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IApproveExchange>()
  const approveExchange = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, 'Mark3dCollection')
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    console.log('approve exchange', 'exchange contract address', config?.exchangeToken.address, 'tokenId', tokenId)

    return callContract({ contract, method: 'approve' },
      config?.exchangeToken.address,
      BigInt(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [wrapPromise, contract])

  return {
    ...statuses,
    approveExchange,
  }
}
