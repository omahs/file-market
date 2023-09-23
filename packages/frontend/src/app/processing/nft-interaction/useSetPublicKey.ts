import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useBlockchainDataProvider } from '../BlockchainDataProvider'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, hexToBuffer } from '../utils'
import { useCallContract } from '../../hooks/useCallContract'

interface IUseSetPublicKey {
  collectionAddress?: string
}

interface ISetPublicKey {
  tokenId?: string
}

export function useSetPublicKey({ collectionAddress }: IUseSetPublicKey = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const config = useConfig()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt, ISetPublicKey>()
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

    return callContract({ contract, method: 'setTransferPublicKey' },
      BigInt(tokenId),
      bufferToEtherHex(publicKey),
      BigInt(dealNumber),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, address, wrapPromise])

  return { ...statuses, setPublicKey }
}
