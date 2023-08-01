import { ConnectFileWalletDialog } from '../components/Web3/ConnectFileWalletDialog'
import useAppAuthAndConnect from './useAppAuthAndConnect'
import { useStores } from './useStores'

export const useAuth = () => {
  const { dialogStore } = useStores()
  const { connect } = useAppAuthAndConnect()
  const openDialog = () => {
    dialogStore.openDialog({
      component: ConnectFileWalletDialog,
      props: {
        // @ts-expect-error
        name: 'ConnectMain',
        openWeb3Modal: connect,
      },
    })
  }

  return {
    connect: openDialog,
  }
}
