import { useWeb3Modal } from '@web3modal/react'
import assert from 'assert'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import { InProcessBodyProps, LoadingModal } from '../components/Modal/Modal'
import { DialogProps } from '../utils/dialog'
import { useAfterDidMountEffect } from './useDidMountEffect'
import { useStores } from './useStores'

export default function useAppAuthAndConnect() {
  const { disconnect } = useDisconnect()
  const { isConnected, address, connector } = useAccount()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isACanAuthEffect, setIsACanAuthEffect] = useState<boolean>(false)
  const [addressState, setAddressState] = useState<string | undefined>()
  const { authStore, dialogStore } = useStores()
  const { open, setDefaultChain } = useWeb3Modal()
  const { signMessage } = useSignMessage({
    async onSuccess(data) {
      try {
        if ((addressState ?? address) !== undefined) {
          // @ts-expect-error
          await authStore.loginBySignature({ address: addressState ?? address, signature: data.substring(2, data.length) })
          setIsLoading(false)
        }
      } catch (e: any) {
        disconnect()
        setIsLoading(false)
      }
    },
    onError(data) {
      disconnect()
      setIsLoading(false)
    },
  })

  useEffect(() => {
    if (isConnected && isACanAuthEffect) {
      assert(address, 'address is undefined')
      authStore.setAddress(address)
      setAddressState(address)
      console.log('SIGN')
      setIsLoading(true)
      authStore.getMessageForAuth(address).then((res) => {
        signMessage({ message: res.data.message })
      }).catch((e: any) => {
        setIsLoading(false)
        disconnect()
      })
    }
  }, [isConnected, isACanAuthEffect])

  // useErrorWindow(errorConnect?.message)
  // useErrorWindow(errorSign?.message)

  const connect = useCallback(async () => {
    if (isConnected && address) {
      console.log(connector)
      console.log('Connector')
      setAddressState(address)
      await authStore.getMessageForAuth(address).then((res) => {
        signMessage({ message: res.data.message })
      }).catch((e: any) => {
        setIsLoading(false)
        disconnect()
      })
    } else {
      void open().then(() => {
        setIsACanAuthEffect(true)
      })
        .catch((e) => {
          setIsLoading(false)
        })
    }
  }, [isConnected, address, connector])

  useAfterDidMountEffect(() => {
    if (isLoading) {
      if (dialogStore.isDialogOpenByName('LoadingSign')) return
      dialogStore.openDialog<InProcessBodyProps & DialogProps>({
        component: LoadingModal,
        props: {
          // @ts-expect-error
          name: 'LoadingSign',
          text: 'Please sign the message',
        },
      })
    } else {
      dialogStore.closeDialogByName('LoadingSign')
    }
  }, [isLoading])

  return { connect, isLoading, setDefaultChain }
}
