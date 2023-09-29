import { useEffect } from 'react'

import { wagmiConfig } from '../config/web3Modal'
import { useStores } from './useStores'

export const useBlockNumberListener = () => {
  const { blockStore } = useStores()
  useEffect(() => {
    const unsubscribe = wagmiConfig.publicClient.watchBlockNumber(
      {
        onBlockNumber: blockNumber => {
          blockStore.setCurrentBlock(blockNumber)
        },
        pollingInterval: 5000,
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])
}
