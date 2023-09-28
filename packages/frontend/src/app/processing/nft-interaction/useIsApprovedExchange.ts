import { getAddress } from 'viem'

import { useConfig } from '../../hooks/useConfig'
import { type TokenFullId } from '../types'
import { useGetApproved } from './useGetApproved'

export function useIsApprovedExchange(tokenFullId: Partial<TokenFullId> & { isDisable?: boolean }) {
  const { data, ...statuses } = useGetApproved(tokenFullId)
  const config = useConfig()

  return {
    ...statuses,
    isApprovedExchange: data && getAddress(data) === getAddress(config.exchangeToken.address),
  }
}
