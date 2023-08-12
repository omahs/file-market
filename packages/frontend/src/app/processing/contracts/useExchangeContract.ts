import { useContract, useSigner } from 'wagmi'

import { useConfig } from '../../hooks/useConfig'

export function useExchangeContract() {
  const config = useConfig()
  const { data: signer } = useSigner()
  const contract = useContract({
    address: config?.exchangeToken.address,
    abi: config?.exchangeToken.abi,
    signerOrProvider: signer,
  })

  return { contract, signer }
}
