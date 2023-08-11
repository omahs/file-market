import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { useAccount } from 'wagmi'

import { useStores } from '../../../hooks'
import useLogoutAndDisconnect from '../../../hooks/useLogoutAndDisconnect'
import { useRefreshToken } from '../../../hooks/useRefreshToken'
import useWatchFileWalletConnect from '../../../processing/nft-interaction/useWatchFileWalletConnect'

export const FileWalletConnectWatcher: FC = observer(() => {
  const { disconnect } = useLogoutAndDisconnect()
  const { authStore } = useStores()

  useAccount({
    onDisconnect() {
      disconnect()
    },
  })

  useWatchFileWalletConnect()
  useRefreshToken()

  useEffect(() => {
    if (authStore.isActualAccessToken) {
      void authStore.checkAuth()
    }
  }, [])

  return null
})
