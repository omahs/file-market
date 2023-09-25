import assert from 'assert'
import { type ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { nullAddress } from '../utils'
import { assertContract } from '../utils/assert'

interface IUseInitTransfer {
  collectionAddress?: `0x${string}`
}

interface IInitTransfer {
  tokenId?: string
  to?: string
}

export function useInitTransfer({ collectionAddress }: IUseInitTransfer = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt, IInitTransfer>()
  const config = useConfig()
  const { callContract } = useCallContract()

  const initTransfer = useCallback(wrapPromise(async ({ tokenId, to }: IInitTransfer) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assert(to, 'receiver address ("to") is undefined')
    console.log('init transfer', { tokenId, to, callbackReceiver: nullAddress })

    return callContract({ contract, method: 'initTransfer', params: { gasPrice: config?.gasPrice } },
      BigInt(tokenId ?? 0),
      to,
      '0x00',
      nullAddress,
    )
  }), [contract, wrapPromise])

  return {
    ...statuses,
    initTransfer,
  }
}
