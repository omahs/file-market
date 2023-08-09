import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { EFTSubscriptionRequest } from '../../swagger/Api'
import { Params } from '../utils/router'
import { useStores } from './useStores'

interface IUseSubscribeToEft {
  isDisableListener?: boolean
}

export const useSubscribeToEft = (props?: IUseSubscribeToEft) => {
  const { collectionAddress, tokenId, chainName } = useParams<Params>()
  const { socketStore } = useStores()

  const subscribe = (params: EFTSubscriptionRequest, chainName?: string) => {
    socketStore.subscribeToEft(params, chainName)
  }

  useEffect(() => {
    if (!props?.isDisableListener) socketStore.subscribeToEft({ collectionAddress, tokenId }, chainName)
  }, [props?.isDisableListener, chainName, collectionAddress, tokenId])

  return {
    subscribe,
  }
}
