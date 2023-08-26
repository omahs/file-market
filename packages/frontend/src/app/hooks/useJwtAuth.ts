import { useCallback } from 'react'

import { IUseAppAuthAndConnect } from './useAppAuthAndConnect'
import { useAuth } from './useAuth'
import { useIsConnected } from './useIsConnected'

export const useJwtAuth = (props: IUseAppAuthAndConnect) => {
  const { connect } = useAuth(props)
  const isConnected = useIsConnected()

  const connectFunc = useCallback(() => {
    if (!isConnected) {
      connect()
    } else {
      props.onSuccess?.()
    }
  }, [isConnected])

  return connectFunc
}
