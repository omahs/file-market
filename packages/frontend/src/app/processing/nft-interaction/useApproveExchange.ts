import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

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
  const { contract, signer } = useCollectionContract(collectionAddress)
  const config = useConfig()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IApproveExchange>()
  const approveExchange = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, 'Mark3dCollection')
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    console.log('approve exchange', 'exchange contract address', config?.exchangeToken.address, 'tokenId', tokenId)

    return callContract({ contract, method: 'approve' },
      config?.exchangeToken.address,
      BigNumber.from(tokenId),
      { gasPrice: config?.gasPrice },
    )
  }), [wrapPromise, contract, signer])

  return {
    ...statuses,
    approveExchange,
  }
}
