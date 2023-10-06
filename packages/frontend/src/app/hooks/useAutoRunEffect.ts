import { autorun } from 'mobx'
import { type DependencyList, type EffectCallback, useEffect } from 'react'

export const useAutorunEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  useEffect(() => autorun(effect), [deps])
}
