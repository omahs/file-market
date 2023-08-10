import { utils } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Token } from '../../../swagger/Api'

export function useIsOwner(tokenData: Token | undefined) {
  const { address } = useAccount()
  const isOwner = useMemo(() => {
    if (address && tokenData?.owner) {
      return {
        isOwner: utils.getAddress(tokenData?.owner) === utils.getAddress(address),
      }
    }

    return false
  }, [address, tokenData?.owner])

  return {
    isOwner,
  }
}
