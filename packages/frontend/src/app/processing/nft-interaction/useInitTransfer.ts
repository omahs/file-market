import assert from 'assert'
import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { assertConfig, nullAddress } from '../utils'

interface IInitTransfer {
  tokenId?: string
  to?: string
  collectionAddress?: string
}

export function useInitTransfer() {
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt, IInitTransfer>()
  const config = useConfig()
  const { callContract } = useCallContract()

  const initTransfer = useCallback(wrapPromise(async ({ tokenId, to, collectionAddress }: IInitTransfer) => {
    assert(to, 'receiver address ("to") is undefined')
    assertConfig(config)
    console.log('init transfer', { tokenId, to, callbackReceiver: nullAddress })

    return callContract({
      callContractConfig: {
        address: collectionAddress as `0x${string}`,
        abi: config.collectionToken.abi,
        functionName: 'initTransfer',
        gasPrice: config?.gasPrice,
        args: [BigInt(tokenId ?? 0),
          to as `0x${string}`,
          '0x00',
          nullAddress],
      },
    },
    )
  }), [config, wrapPromise])

  return {
    ...statuses,
    initTransfer,
  }
}
