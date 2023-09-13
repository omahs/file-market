import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Transfer } from '../../../swagger/Api'
import { useStores } from '../../hooks'
import useIntervalAsync from '../../hooks/useIntervalAsync'
import { TokenFullId } from '../types'
import { useIsApprovedExchange } from './useIsApprovedExchange'
import { useIsBuyer } from './useIsBuyer'
import { useIsOwner } from './useIsOwner'

export interface useWatchStatusesTransferProps {
  tokenFullId: TokenFullId
  isNetworkIncorrect?: boolean
}

export interface IUseWatchStatusesTransfer {
  isOwner?: boolean
  transfer?: Transfer
  isLoading: boolean
  error: any
  isApprovedExchange?: boolean
  isBuyer?: boolean
  runIsApprovedRefetch: () => void
}

export const useWatchStatusesTransfer = ({ tokenFullId, isNetworkIncorrect }: useWatchStatusesTransferProps): IUseWatchStatusesTransfer => {
  const { transferStore, tokenStore } = useStores()
  const { isConnected } = useAccount()
  const { isOwner } = useIsOwner(tokenStore.data)
  const isBuyer = useIsBuyer(transferStore.data)
  const { isApprovedExchange, error: isApprovedExchangeError, refetch: refetchIsApproved } = useIsApprovedExchange({
    ...tokenFullId,
    isDisable: isNetworkIncorrect || !isConnected,
  })

  const { flush: flushIsApprovedRefetch, run: runIsApprovedRefetch } = useIntervalAsync(() => {
    return refetchIsApproved()
  }, 3000)

  useEffect(() => {
    transferStore.setOnTransferFinished(() => {
      runIsApprovedRefetch()
    })
    transferStore.setOnTransferPublicKeySet(() => {
      refetchIsApproved()
    })
  }, [])

  useEffect(() => {
    flushIsApprovedRefetch()
    transferStore.setIsWaitingForEvent(false)
  }, [isApprovedExchange])

  const isLoading = useMemo(() => {
    return transferStore.isWaitingForEvent !== transferStore.isWaitingForReciept
  }, [transferStore.isWaitingForEvent, transferStore.isWaitingForReciept])

  const error = useMemo(() => {
    return isApprovedExchangeError
  }, [isApprovedExchangeError])

  return {
    isLoading,
    runIsApprovedRefetch,
    isOwner,
    isBuyer,
    error,
    transfer: transferStore.data,
    isApprovedExchange,
  }
}
