import { BigNumber } from 'ethers'
import { useContractRead } from 'wagmi'

import { useConfig } from '../../hooks/useConfig'
import { TokenFullId } from '../types'
import { ensureAddress } from '../utils/address'

export function useOwnerOfNFT({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const config = useConfig()

  return useContractRead({
    address: ensureAddress(collectionAddress),
    abi: config?.collectionToken.abi,
    functionName: 'ownerOf',
    args: [BigNumber.from(tokenId)],
    suspense: !tokenId,
  })
}
