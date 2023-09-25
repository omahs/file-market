import { utils } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { type Token } from '../../../swagger/Api'

export function useIsOwner(tokenData: Token | undefined) {
  const { address } = useAccount()
  const isOwner = useMemo(() => {
    if (address && tokenData?.owner) {
      console.log(utils.getAddress(tokenData?.owner) === utils.getAddress(address))

      return utils.getAddress(tokenData?.owner) === utils.getAddress(address)
    }
    console.log(false)

    return false
  }, [address, tokenData?.owner])

  return {
    isOwner,
  }
}
