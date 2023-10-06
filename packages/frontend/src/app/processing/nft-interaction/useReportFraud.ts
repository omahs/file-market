import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import {
  assertAccount,
  assertCollection,
  assertConfig,
  assertTokenId,
  bufferToEtherHex,
} from '../utils'

interface IReportFraud {
  tokenId?: string
  collectionAddress?: string
}

export function useReportFraud() {
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<TransactionReceipt, IReportFraud>()
  const config = useConfig()

  const { callContract } = useCallContract()

  const factory = useHiddenFileProcessorFactory()

  const reportFraud = useCallback(wrapPromise(async ({ tokenId, collectionAddress }) => {
    assertConfig(config)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const privateKey = await buyer.revealRsaPrivateKey()
    console.log('report fraud', { tokenId, privateKey })

    return callContract({
      callContractConfig: {
        address: collectionAddress as `0x${string}`,
        abi: config.collectionToken.abi,
        functionName: 'reportFraud',
        gasPrice: config?.gasPrice,
        args: [BigInt(tokenId),
          bufferToEtherHex(privateKey)],
      },
    })
  }), [config, address, wrapPromise])

  return {
    ...statuses,
    reportFraud,
  }
}
