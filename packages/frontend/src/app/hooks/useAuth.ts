import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import useAppAuthAndConnect from './useAppAuthAndConnect'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useStores } from './useStores'

export const useAuth = () => {
  const { dialogStore } = useStores()
  const { address } = useAccount()
  const currentBlockChainStore = useCurrentBlockChain()
  const { connect: openWeb3Modal, setDefaultChain, isLoading } = useAppAuthAndConnect()

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
  }, [currentBlockChainStore.chainId, address])

  return {
    connect,
    setDefaultChain,
    isLoading,
  }
}
