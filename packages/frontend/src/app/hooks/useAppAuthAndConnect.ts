import { useWeb3Modal } from '@web3modal/react'
import assert from 'assert'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import { useStores } from './useStores'

export default function useAppAuthAndConnect() {
  const { disconnect } = useDisconnect()
  const { isConnected, address, connector } = useAccount()
  const [isACanAuthEffect, setIsACanAuthEffect] = useState<boolean>(false)
  const [addressState, setAddressState] = useState<string | undefined>()
  const { authStore } = useStores()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { open, setDefaultChain } = useWeb3Modal()
  const { signMessage } = useSignMessage({
    async onSuccess(data) {
      try {
        if ((addressState ?? address) !== undefined) {
          // @ts-expect-error
          await authStore.loginBySignature({ address: addressState ?? address, signature: data.substring(2, data.length) })
        }
      } catch (e: any) {
        disconnect()
      }
    },
    onError(data) {
      disconnect()
    },
  })

  useEffect(() => {
    if (isConnected && isACanAuthEffect) {
      assert(address, 'address is undefined')
      authStore.setAddress(address)
      setAddressState(address)
      setIsLoading(true)
      console.log('SIGN')
      authStore.getMessageForAuth(address).then((res) => {
        signMessage({ message: res.data.message })
      }).catch((e: any) => {
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
      console.log(connector)
      console.log('Connector')
      setAddressState(address)
      await authStore.getMessageForAuth(address).then((res) => {
        signMessage({ message: res.data.message })
      }).catch((e: any) => {
        disconnect()
      })
    } else {
      void open().then(() => {
        setIsACanAuthEffect(true)
      })
        .catch((e) => {
        })
    }
  }, [isConnected, address])

  return { connect, isLoading, setDefaultChain }
}
