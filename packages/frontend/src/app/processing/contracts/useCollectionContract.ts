import { useContract, useSigner } from 'wagmi'

import { useConfig } from '../../hooks/useConfig'

export function useCollectionContract(address?: string) {
  const { data: signer } = useSigner()
  const config = useConfig()
  const contract = useContract({
    address,
    abi: config?.collectionToken.abi,
    signerOrProvider: signer,
  })

  return { contract, signer }
}
