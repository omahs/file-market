import { utils } from 'ethers'

import { useConfig } from '../../hooks/useConfig'
import { type TokenFullId } from '../types'
import { useGetApproved } from './useGetApproved'

export function useIsApprovedExchange(tokenFullId: Partial<TokenFullId> & { isDisable?: boolean }) {
  const { data, ...statuses } = useGetApproved(tokenFullId)
  const config = useConfig()

  return {
    ...statuses,
    isApprovedExchange: data && utils.getAddress(data) === utils.getAddress(config.exchangeToken.address),
  }
}
