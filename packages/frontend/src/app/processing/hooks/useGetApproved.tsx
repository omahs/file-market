import { TokenFullId } from '../types'
import { useContractRead } from 'wagmi'
import { mark3dConfig } from '../../config/mark3d'
import { BigNumber } from 'ethers'
import { ensureAddress } from '../utils/address'

export function useGetApproved({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  return useContractRead({
    address: ensureAddress(collectionAddress),
    abi: mark3dConfig.collectionToken.abi,
    functionName: 'getApproved',
    args: [BigNumber.from(tokenId ?? 0)],
    suspense: !tokenId
  })
}