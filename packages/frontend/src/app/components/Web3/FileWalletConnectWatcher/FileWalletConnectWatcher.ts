import { observer } from 'mobx-react-lite'
import { type FC, useEffect } from 'react'
import { useAccount } from 'wagmi'

import { useStores } from '../../../hooks'
import useLogoutAndDisconnect from '../../../hooks/useLogoutAndDisconnect'
import useWatchFileWalletConnect from '../../../processing/nft-interaction/useWatchFileWalletConnect'
import { checkIsActualToken } from '../../../utils/auth/checkIsActualToken'

export const FileWalletConnectWatcher: FC = observer(() => {
  const { disconnect } = useLogoutAndDisconnect()
  const { authStore } = useStores()

  useAccount({
    onDisconnect() {
      disconnect()
    },
  })

  useWatchFileWalletConnect()

  useEffect(() => {
    void checkIsActualToken({ disconnect })
  }, [authStore.isActualAccessToken, authStore.isActualRefreshToken, disconnect])

  useEffect(() => {
    if (authStore.isActualAccessToken) {
      void authStore.checkAuth()
    }
  }, [])

  return null
})
