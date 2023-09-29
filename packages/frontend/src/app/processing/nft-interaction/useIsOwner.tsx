import { useMemo } from 'react'
import { getAddress } from 'viem'
import { useAccount } from 'wagmi'

import { type Token } from '../../../swagger/Api'

export function useIsOwner(tokenData: Token | undefined) {
  const { address } = useAccount()
  const isOwner = useMemo(() => {
    if (address && tokenData?.owner) {
      return getAddress(tokenData?.owner) === getAddress(address)
    }

    return false
  }, [address, tokenData?.owner])

  return {
    isOwner,
  }
}
