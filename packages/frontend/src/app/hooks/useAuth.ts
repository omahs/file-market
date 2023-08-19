import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import useAppAuthAndConnect, { IUseAppAuthAndConnect } from './useAppAuthAndConnect'
import { useCurrentBlockChain } from './useCurrentBlockChain'
import { useStores } from './useStores'

type IUseAuth = IUseAppAuthAndConnect

export const useAuth = (props?: IUseAuth) => {
  const { dialogStore } = useStores()
  const { address, isConnected } = useAccount()
  const currentBlockChainStore = useCurrentBlockChain()
  const { connect: openWeb3Modal, setDefaultChain, isLoading } = useAppAuthAndConnect(props)

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
    if (props?.isWithSign && isConnected) {
      openWeb3Modal()
    } else {
      openDialog()
    }
  }, [currentBlockChainStore.chainId, address, isConnected, props?.isWithSign])

  return {
    connect,
    setDefaultChain,
    isLoading,
  }
}
