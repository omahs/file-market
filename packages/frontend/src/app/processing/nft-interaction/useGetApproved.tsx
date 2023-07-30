import { BigNumber } from 'ethers'
import { useContractRead } from 'wagmi'

import { useConfig } from '../../hooks/useConfig'
import { TokenFullId } from '../types'
import { ensureAddress } from '../utils/address'

export function useGetApproved({ collectionAddress, tokenId }: Partial<TokenFullId>) {
  const config = useConfig()

  return useContractRead({
    address: ensureAddress(collectionAddress),
    abi: config?.collectionToken.abi,
    functionName: 'getApproved',
    args: [BigNumber.from(tokenId ?? 0)],
    suspense: !tokenId,
  })
}
