import { useContractRead } from 'wagmi'

import { useConfig } from '../../hooks/useConfig'
import { TokenFullId } from '../types'
import { ensureAddress } from '../utils/address'

export function useOwnerOfNFT({ collectionAddress, tokenId, isDisable }: Partial<TokenFullId> & { isDisable?: boolean }) {
  const config = useConfig()

  return useContractRead({
    address: ensureAddress(collectionAddress),
    abi: config?.collectionToken.abi,
    functionName: !isDisable ? 'ownerOf' : undefined,
    args: [BigInt(tokenId)],
    suspense: !tokenId,
    enabled: !isDisable,
  })
}
