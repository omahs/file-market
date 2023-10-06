import { autorun } from 'mobx'
import { type DependencyList, type EffectCallback, useCallback } from 'react'

export const useAutoRunCallback = (effect: EffectCallback, deps?: DependencyList) => {
  return useCallback((props: any) => autorun(effect), [deps])
}
