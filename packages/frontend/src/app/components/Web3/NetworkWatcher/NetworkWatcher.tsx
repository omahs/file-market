import { useListenNetwork } from '../../../hooks/useListenNetwork'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'

const NetworkWatcher = () => {
  useMultiChainStore()
  useListenNetwork()

  return null
}

export default NetworkWatcher
