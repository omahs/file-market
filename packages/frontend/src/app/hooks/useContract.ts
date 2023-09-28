import assert from 'assert'
import { useMemo } from 'react'
import { type Abi, getAddress } from 'viem'
import { useNetwork, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

import { assertAccount } from '../processing'

export const useContract = <A extends Abi>(address: string | undefined, abi: A | undefined) => {
  const { chain } = useNetwork()
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    try {
      assertAccount(address)
      assert(walletClient, 'wallet client not found')
      assert(abi, 'abi not found')
      assert(chain, 'chain not found')

      return getContract({
        abi,
        address: getAddress(address),
        walletClient,
      })
    } catch (error) {
      console.error('Failed to get contract', error)

      return null
    }
  }, [address, abi, chain, walletClient])
}
