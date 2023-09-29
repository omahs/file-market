import { computed } from 'mobx'
import { type DependencyList, useMemo } from 'react'

export const useComputedMemo = <T>(factory: () => T, deps?: DependencyList): T => {
  return useMemo(() => computed(factory), deps).get()
}
