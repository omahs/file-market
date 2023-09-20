import { GetContractArgs } from '@wagmi/core'
import { useMemo } from 'react'
import { getContract } from 'wagmi/actions'

export const useContract = (props: GetContractArgs) => {
  const contract = useMemo(() => {
    return getContract(props)
  }, [props])

  return contract
}
