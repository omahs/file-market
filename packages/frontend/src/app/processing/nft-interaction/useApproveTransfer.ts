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
  collectionAddress?: string
}

interface IApproveTransfer {
  tokenId?: string
  publicKey?: string
}

export function useApproveTransfer({ collectionAddress }: IUseApproveTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress as `0x${string}`)
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

    return callContract<typeof contract.abi, 'approveTransfer'>(
      {
        callContractConfig: {
          address: contract.address,
          abi: contract.abi,
          functionName: 'approveTransfer',
          gasPrice: config?.gasPrice,
          args: [BigInt(tokenId), bufferToEtherHex(encryptedFilePassword)],
        },
      },
    )
  }), [contract, address, wrapPromise])

  return {
    ...statuses,
    approveTransfer,
  }
}
