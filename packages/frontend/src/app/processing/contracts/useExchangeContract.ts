import { useConfig } from '../../hooks/useConfig'
import { useContract } from '../../hooks/useContract'

export function useExchangeContract() {
  const config = useConfig()

  const contract = useContract(config?.exchangeToken.address, config?.exchangeToken.abi)

  return { contract }
}
