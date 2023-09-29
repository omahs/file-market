import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useBlockchainDataProvider } from '../BlockchainDataProvider'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import {
  assertAccount,
  assertCollection,
  assertConfig,
  assertTokenId,
  bufferToEtherHex,
  hexToBuffer,
} from '../utils'

interface ISetPublicKey {
  tokenId?: string
  collectionAddress?: string
}

export function useSetPublicKey() {
  const { address } = useAccount()
  const config = useConfig()
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt, ISetPublicKey>()
  const factory = useHiddenFileProcessorFactory()
  const blockchainDataProvider = useBlockchainDataProvider()

  const { callContract } = useCallContract()

  const setPublicKey = useCallback(wrapPromise(async ({ tokenId, collectionAddress }) => {
    assertConfig(config)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    const dealNumber = await blockchainDataProvider.getTransferCount(hexToBuffer(collectionAddress), +tokenId)
    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const publicKey = await buyer.initBuy()
    console.log('setTransferPublicKey', { tokenId, publicKey })

    return callContract({
      callContractConfig: {
        address: collectionAddress as `0x${string}`,
        abi: config.collectionToken.abi,
        functionName: 'setTransferPublicKey',
        gasPrice: config?.gasPrice,
        args: [BigInt(tokenId),
          bufferToEtherHex(publicKey),
          BigInt(dealNumber)],
      },
    })
  }), [config, address, wrapPromise])

  return { ...statuses, setPublicKey }
}
