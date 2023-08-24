import { utils } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Token } from '../../../swagger/Api'

export function useIsCreator(tokenData: Token | undefined) {
  const { address } = useAccount()
  const isCreator = useMemo(() => {
    if (address && tokenData?.creator) {
      console.log(utils.getAddress(tokenData?.creator) === utils.getAddress(address))

      return utils.getAddress(tokenData?.creator) === utils.getAddress(address)
    }
    console.log(false)

    return false
  }, [address, tokenData?.owner])

  return {
    isCreator,
  }
}
