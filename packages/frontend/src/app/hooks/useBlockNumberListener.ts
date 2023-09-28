import { wagmiConfig } from '../config/web3Modal'
import { useStores } from './useStores'

export const useBlockNumberListener = () => {
  const { blockStore } = useStores()
  wagmiConfig.publicClient.watchBlockNumber(
    {
      onBlockNumber: blockNumber => {
        blockStore.setCurrentBlock(blockNumber)
      },
      pollingInterval: 5000,
    },
  )
}
