import { useContract, useSigner } from 'wagmi'

import { useConfig } from '../../hooks/useConfig'

// This hook MUST be called only when user is connected to metamask
export function useAccessTokenContract() {
  const config = useConfig()
  const { data: signer } = useSigner()
  const contract = useContract({
    address: config?.accessToken.address,
    abi: config?.accessToken.abi,
    signerOrProvider: signer,
  })

  return { contract, signer }
}
