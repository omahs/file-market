import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Params } from '../utils/router'
import { useStores } from './useStores'

export const useSubscribeToEft = () => {
  const { collectionAddress, tokenId, chainName } = useParams<Params>()
  const { socketStore } = useStores()
  useEffect(() => {
    socketStore.subscribeToEft({ address: collectionAddress as `0x${string}`, id: tokenId }, chainName)

    return () => {
      console.log('UNSUBSCRIBE')
      socketStore.unsubscribeEft()
    }
  }, [])
}
