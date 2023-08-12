import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'

import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useStores } from './useStores'

export const useAuth = () => {
  const { dialogStore } = useStores()
  const currentBlockChainStore = useCurrentBlockChain()
  const { open: openWeb3Modal, setDefaultChain } = useWeb3Modal()

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
    openDialog()
  }, [currentBlockChainStore.chainId])

  return {
    connect,
    setDefaultChain,
  }
}
