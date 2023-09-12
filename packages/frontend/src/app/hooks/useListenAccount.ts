// import { useAccount } from 'wagmi'
// import { rootStore } from '../stores/RootStore'
// import { useEffect } from 'react'
// import useLogoutAndDisconnect from './useLogoutAndDisconnect'
// import { useStores } from './useStores'

export default function useListenAccount() {
  // const { address, isConnected } = useAccount()
  // const { profileStore } = useStores()
  // const { disconnect } = useLogoutAndDisconnect()
  // const [checkIsConnected, setCheckIsConnected] = useState<boolean>(false)
  // useEffect(() => {
  //   if (isConnected &&
  //       profileStore.user?.address?.toLowerCase() !== address?.toLowerCase() &&
  //       address !== undefined &&
  //       rootStore.authStore.isAuth) {
  //     disconnect()
  //   }
  // }, [address, isConnected, rootStore.playerStore.player?.address, rootStore.authStore.isAuth])

  // useEffect(() => {
  //   if (!isConnected) {
  //     if (checkIsConnected) {
  //       console.log('2')
  //       setCheckIsConnected(false)
  //       disconnect()
  //     }
  //     setTimeout(() => {
  //       setCheckIsConnected(true)
  //     }, 3000)
  //   }
  //   if (isConnected) {
  //     setCheckIsConnected(false)
  //   }
  // }, [isConnected, checkIsConnected])
}
