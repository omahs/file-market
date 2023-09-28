import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useBlockchainDataProvider } from '../BlockchainDataProvider'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertTokenId, bufferToEtherHex, hexToBuffer } from '../utils'

interface IUseSetPublicKey {
  collectionAddress?: string
}

interface ISetPublicKey {
  tokenId?: string
}

export function useSetPublicKey({ collectionAddress }: IUseSetPublicKey = {}) {
  const { contract } = useCollectionContract(collectionAddress as `0x${string}`)
  const { address } = useAccount()
  const config = useConfig()
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt, ISetPublicKey>()
  const factory = useHiddenFileProcessorFactory()
  const blockchainDataProvider = useBlockchainDataProvider()

  const { callContract } = useCallContract()

  const setPublicKey = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, config?.exchangeToken.name ?? '')
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    const dealNumber = await blockchainDataProvider.getTransferCount(hexToBuffer(collectionAddress), +tokenId)
    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const publicKey = await buyer.initBuy()
    console.log('setTransferPublicKey', { tokenId, publicKey })

    return callContract({
      callContractConfig: {
        address: contract.address,
        abi: contract.abi,
        functionName: 'setTransferPublicKey',
        gasPrice: config?.gasPrice,
        args: [BigInt(tokenId),
          bufferToEtherHex(publicKey),
          BigInt(dealNumber)],
      },
    })
  }), [contract, address, wrapPromise])

  return { ...statuses, setPublicKey }
}
