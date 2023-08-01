import { useWeb3Modal } from '@web3modal/react'
import assert from 'assert'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import { rootStore } from '../stores/RootStore'
import useErrorWindow from './useErrorWindow'
import { useStores } from './useStores'

export default function useAppAuthAndConnect() {
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const [isACanAuthEffect, setIsACanAuthEffect] = useState<boolean>(false)
  const [addressState, setAddressState] = useState<string | undefined>()
  const { authStore } = useStores()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { open, setDefaultChain } = useWeb3Modal()
  const errorFunc = useErrorWindow()
  const { signMessage } = useSignMessage({
    async onSuccess(data) {
      try {
        if ((addressState ?? address) !== undefined) {
          // @ts-expect-error
          await rootStore.authStore.loginBySignature({ address: addressState ?? address, signature: data.substring(2, data.length) })
        }
      } catch (e: any) {
        disconnect()
      }
    },
    onError(data) {
      errorFunc(data)
      disconnect()
    },
  })

  useEffect(() => {
    if (isConnected && isACanAuthEffect) {
      assert(address, 'address is undefined')
      rootStore.authStore.setAddress(address)
      setAddressState(address)
      setIsLoading(true)
      rootStore.authStore.getMessageForAuth(address).then((res) => {
        signMessage({ message: res.data.message })
      }).catch((e: any) => {
        errorFunc(e)
        disconnect()
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [isConnected, isACanAuthEffect])

  // useErrorWindow(errorConnect?.message)
  // useErrorWindow(errorSign?.message)

  const connect = useCallback(async () => {
    if (isConnected && address) {
      setAddressState(address)
      await rootStore.authStore.getMessageForAuth(address).then((res) => {
        signMessage({ message: res.data.message })
      }).catch((e: any) => {
        errorFunc(e)
        disconnect()
      })
    } else {
      void open().then(() => {
        setIsACanAuthEffect(true)
      })
        .catch((e) => {
          errorFunc(e)
        })
    }
  }, [isConnected, address])

  return { connect, isLoading, setDefaultChain }
}
