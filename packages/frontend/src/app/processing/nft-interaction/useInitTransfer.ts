import assert from 'assert'
import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { nullAddress } from '../utils'
import { assertContract } from '../utils/assert'

interface IUseInitTransfer {
  collectionAddress?: string
}

interface IInitTransfer {
  tokenId?: string
  to?: string
}

export function useInitTransfer({ collectionAddress }: IUseInitTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress as `0x${string}`)
  const { wrapPromise, statuses } = useStatusState<TransactionReceipt, IInitTransfer>()
  const config = useConfig()
  const { callContract } = useCallContract()

  const initTransfer = useCallback(wrapPromise(async ({ tokenId, to }: IInitTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assert(to, 'receiver address ("to") is undefined')
    console.log('init transfer', { tokenId, to, callbackReceiver: nullAddress })

    return callContract({
      callContractConfig: {
        address: contract.address,
        abi: contract.abi,
        functionName: '',
        gasPrice: config?.gasPrice,
        args: [BigInt(tokenId ?? 0),
          to,
          '0x00',
          nullAddress],
      },
    },
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    initTransfer,
  }
}
