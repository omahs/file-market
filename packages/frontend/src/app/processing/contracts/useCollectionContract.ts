import { useConfig } from '../../hooks/useConfig'
import { useContract } from '../../hooks/useContract'

export function useCollectionContract(address: `0x${string}`) {
  const config = useConfig()

  const contract = useContract({ address, abi: config?.collectionToken.abi })

  return { contract }
}
