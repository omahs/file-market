import { useMemo } from 'react'

import { useCurrentBlockChain } from './useCurrentBlockChain'

export const useApi = () => {
  const currentBlockChainStore = useCurrentBlockChain()

  const api = useMemo(() => {
    return currentBlockChainStore.api
  }, [currentBlockChainStore.api])

  return api
}
