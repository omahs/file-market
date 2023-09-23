import { useConfig } from '../../hooks/useConfig'
import { useContract } from '../../hooks/useContract'

export function useExchangeContract() {
  const config = useConfig()

  const contract = useContract({ address: config?.exchangeToken.address, abi: config?.exchangeToken.abi })


  return { contract }
}
