import { useCallback } from 'react'

import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import useAppAuthAndConnect from './useAppAuthAndConnect'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useStores } from './useStores'

export const useAuth = () => {
  const { dialogStore } = useStores()
  const { connect: openWeb3Modal, setDefaultChain } = useAppAuthAndConnect()
  const currentBlockChainStore = useCurrentBlockChain()

  const openDialog = () => {
    dialogStore.openDialog({
      component: ConnectFileWalletDialog,
      props: {
        // @ts-expect-error
        name: 'ConnectMain',
        openWeb3Modal,
      },
    })
  }

  const connect = useCallback(() => {
    setDefaultChain(currentBlockChainStore.chain)
    openDialog()
  }, [currentBlockChainStore.chainId])

  return {
    connect,
  }
}
