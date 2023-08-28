import { useDisconnect } from 'wagmi'

import { stringifyError } from '../utils/error'
import { useStores } from './useStores'

export default function useLogoutAndDisconnect() {
  const { authStore, dialogStore } = useStores()
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      if (authStore.isAuth) {
        authStore.logout().catch((e) => {
          dialogStore.showError(stringifyError(e))
        })
      }
    },
  })

  return { disconnect }
}
