import { useEffect, useMemo } from 'react'

import { Transfer } from '../../../swagger/Api'
import { useStores } from '../../hooks'
import useIntervalAsync from '../../hooks/useIntervalAsync'
import { TokenFullId } from '../types'
import { useIsApprovedExchange } from './useIsApprovedExchange'
import { useIsBuyer } from './useIsBuyer'
import { useIsOwner } from './useIsOwner'

export interface useWatchStatusesTransferProps {
  tokenFullId: TokenFullId
}

export interface IUseWatchStatusesTransfer {
  isOwner?: boolean
  transfer?: Transfer
  isLoading: boolean
  error: any
  isApprovedExchange?: boolean
  isBuyer?: boolean
  runIsApprovedRefetch: () => void
  runIsOwnerRefetch: () => void
}

export const useWatchStatusesTransfer = ({ tokenFullId }: useWatchStatusesTransferProps): IUseWatchStatusesTransfer => {
  const { transferStore } = useStores()
  const { isOwner, error: errorIsOwner, refetch: refetchIsOwner } = useIsOwner(tokenFullId)
  const isBuyer = useIsBuyer(transferStore.data)

  const { isApprovedExchange, error: isApprovedExchangeError, refetch: refetchIsApproved } = useIsApprovedExchange(tokenFullId)

  const { flush: flushIsOwnerRefetch, run: runIsOwnerRefetch } = useIntervalAsync(() => {
    return refetchIsOwner()
  }, 3000)
  const { flush: flushIsApprovedRefetch, run: runIsApprovedRefetch } = useIntervalAsync(() => {
    return refetchIsApproved()
  }, 3000)

  useEffect(() => {
    transferStore.setOnTransferFinished(() => {
      runIsApprovedRefetch()
      runIsOwnerRefetch()
    })
    transferStore.setOnTransferPublicKeySet(() => {
      refetchIsApproved()
    })
  }, [])

  useEffect(() => {
    flushIsOwnerRefetch()
  }, [isOwner])

  useEffect(() => {
    flushIsApprovedRefetch()
    transferStore.setIsWaitingForEvent(false)
  }, [isApprovedExchange])

  const isLoading = useMemo(() => {
    return transferStore.isWaitingForEvent !== transferStore.isWaitingForReciept
  }, [transferStore.isWaitingForEvent, transferStore.isWaitingForReciept])

  const error = useMemo(() => {
    return errorIsOwner ?? (isApprovedExchangeError)
  }, [errorIsOwner, isApprovedExchangeError])

  return {
    isLoading,
    runIsApprovedRefetch,
    runIsOwnerRefetch,
    isOwner,
    isBuyer,
    error,
    transfer: transferStore.data,
    isApprovedExchange,
  }
}
