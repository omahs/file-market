import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useStatusState } from '../../hooks'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, callContract } from '../utils'

interface IUseReportFraud {
  collectionAddress?: string
}

interface IReportFraud {
  tokenId?: string
}

export function useReportFraud({ collectionAddress }: IUseReportFraud = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IReportFraud>()
  const config = useConfig()

  const factory = useHiddenFileProcessorFactory()

  const reportFraud = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const privateKey = await buyer.revealRsaPrivateKey()
    console.log('report fraud', { tokenId, privateKey })

    return callContract({ contract, method: 'reportFraud' },
      BigNumber.from(tokenId),
      bufferToEtherHex(privateKey),
      { gasPrice: config?.gasPrice },
    )
  }), [contract, signer, address, wrapPromise])

  return {
    ...statuses,
    reportFraud,
  }
}
