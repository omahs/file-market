import assert from 'assert'
import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertTokenId, bufferToEtherHex, hexToBuffer } from '../utils'

interface IUseApproveTransfer {
  collectionAddress?: `0x${string}`
}

interface IApproveTransfer {
  tokenId?: string
  publicKey?: string
}

export function useApproveTransfer({ collectionAddress }: IUseApproveTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IApproveTransfer>()
  const factory = useHiddenFileProcessorFactory()
  const { callContract } = useCallContract()
  const config = useConfig()

  const approveTransfer = useCallback(wrapPromise(async ({ tokenId, publicKey }) => {
    assertContract(contract, config?.collectionToken.name)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(publicKey, 'publicKey was not set (or transfer object is null)')

    if (!publicKey.startsWith('0x')) {
      publicKey = `0x${publicKey}`
    }
    const owner = await factory.getOwner(address, collectionAddress, +tokenId)
    const encryptedFilePassword = await owner.encryptFilePassword(hexToBuffer(publicKey))
    console.log('approve transfer', { tokenId, encryptedFilePassword })

    return callContract({ contract, method: 'approveTransfer', params: { gasPrice: config?.gasPrice } },
      BigInt(tokenId),
      bufferToEtherHex(encryptedFilePassword),
    )
  }), [contract, address, wrapPromise])

  return {
    ...statuses,
    approveTransfer,
  }
}
