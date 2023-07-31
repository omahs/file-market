import { useWatchHiddenFileTokenEvents } from '../processing'
import { useTransferStore } from './useTransferStore'

export function useTransferStoreWatchEvents(collectionAddress?: string, tokenId?: string, chainName?: string) {
  const transferStore = useTransferStore(collectionAddress, tokenId, chainName)
  useWatchHiddenFileTokenEvents(transferStore, collectionAddress)

  return transferStore
}
