import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, hexToBuffer } from '../utils'
import { callContract } from '../utils/error'
import { useCallContract } from '../../hooks/useCallContract'

interface IUseApproveTransfer {
  collectionAddress?: string
}

interface IApproveTransfer {
  tokenId?: string
  publicKey?: string
}

export function useApproveTransfer({ collectionAddress }: IUseApproveTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IApproveTransfer>()
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

    return callContract({ contract, method: 'approveTransfer' },
      BigNumber.from(tokenId),
      bufferToEtherHex(encryptedFilePassword),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, address, wrapPromise])

  return {
    ...statuses,
    approveTransfer,
  }
}
