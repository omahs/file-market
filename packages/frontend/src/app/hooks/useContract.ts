import { type GetContractArgs } from '@wagmi/core'
import { useMemo } from 'react'
import { getContract } from 'wagmi/actions'

export const useContract = (props: Omit<GetContractArgs, 'address'> & { address?: `0x${string}` }) => {
  const contract = useMemo(() => {
    if (!props.address) return undefined

    if (typeof props.address !== 'undefined') {
      return getContract({ ...props, address: props.address })
    }
  }, [props])

  return contract
}
