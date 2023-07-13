import { useCallback } from 'react'

import { useStores } from '../../../../hooks'

export function wrapButtonActionsFunction<Arguments extends any = void>() {
  const { transferStore } = useStores()

  const onActionStart = () => {
    // we disable buttons when user starts contract interaction, and enable back when event arrives
    transferStore.setIsWaitingForEvent(true)
    transferStore.setIsWaitingReciept(true)
  }

  const onActionError = () => {
    transferStore.setIsWaitingReciept(false)
    transferStore.setIsWaitingForEvent(false)
  }

  const onActionEnd = () => {
    transferStore.setIsWaitingReciept(false)
  }

  const wrapAction = useCallback((call: (args: Arguments) => Promise<void>) => {
    return async (args: Arguments) => {
      try {
        onActionStart()
        const result = await call(args)
        onActionEnd()

        return result
      } catch (err) {
        onActionError()
        throw err
      }
    }
  }, [])

  return {
    wrapAction,
  }
}
