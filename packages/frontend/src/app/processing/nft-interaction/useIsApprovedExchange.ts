import { utils } from 'ethers'
import { useEffect } from 'react'

import { useConfig } from '../../hooks/useConfig'
import { TokenFullId } from '../types'
import { useGetApproved } from './useGetApproved'

export function useIsApprovedExchange(tokenFullId: Partial<TokenFullId> = {}) {
  const { data, ...statuses } = useGetApproved(tokenFullId)
  const config = useConfig()

  useEffect(() => {
    console.log(config)
  }, [config])

  return {
    ...statuses,
    isApprovedExchange: data && utils.getAddress(data) === utils.getAddress(config.exchangeToken.address),
  }
}
