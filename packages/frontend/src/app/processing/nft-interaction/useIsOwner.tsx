import { utils } from 'ethers'
import { useAccount } from 'wagmi'

import { Token } from '../../../swagger/Api'

export function useIsOwner(tokenData: Token | undefined) {
  const { address } = useAccount()
  if (address && tokenData?.owner) {
    return {
      isOwner: utils.getAddress(tokenData?.owner) === utils.getAddress(address),
    }
  }

  return {
    isOwner: false,
  }
}
