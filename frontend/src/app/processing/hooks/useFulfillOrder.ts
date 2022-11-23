import { useExchangeContract } from './useExchangeContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt, ethers } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { mark3dConfig } from '../../config/mark3d'
import { TokenFullId } from '../types'
import assert from 'assert'

/**
 * Fulfills an existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */
export function useFulfillOrder({ collectionAddress, tokenId }: Partial<TokenFullId>) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const fulfillOrder = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    const buyer = await factory.getBuyer({ collectionAddress, tokenId })
    const publicKey = await buyer.initBuy()
    const result = await contract.fulfillOrder(
      collectionAddress as `0x${string}`,
      ethers.utils.hexlify(Buffer.from(publicKey, 'utf-8')) as `0x${string}`,
      BigNumber.from(tokenId)
    )
    return await result.wait()
  }), [contract, signer, collectionAddress, tokenId])
  return { ...statuses, fulfillOrder }
}
