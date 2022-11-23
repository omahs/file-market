import { useStores } from './useStores'
import { CollectionAndTokenListStore } from '../stores/CollectionAndTokenList/CollectionAndTokenListStore'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param accountAddress
 */
export function useCollectionAndTokenListStore(accountAddress?: `0x${string}`): CollectionAndTokenListStore {
  const { collectionAndTokenList } = useStores()
  useActivateDeactivateRequireParams(collectionAndTokenList, accountAddress)
  return collectionAndTokenList
}
