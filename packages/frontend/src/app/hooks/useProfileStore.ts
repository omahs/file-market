import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing profile details
 * @param collectionAddress
 */
export function useProfileStore(address?: string) {
  const { profileStore } = useStores()
  useActivateDeactivateRequireParams(profileStore, address)

  return profileStore
}
