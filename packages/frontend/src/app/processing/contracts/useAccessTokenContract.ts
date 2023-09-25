import { useConfig } from '../../hooks/useConfig'
import { useContract } from '../../hooks/useContract'

// This hook MUST be called only when user is connected to metamask
export function useAccessTokenContract() {
  const config = useConfig()

  const contract = useContract({ address: config?.accessToken.address, abi: config?.accessToken.abi })

  return { contract }
}
