import { rootStore } from '../../stores/RootStore'

interface checkIsActualTokenProps {
  disconnect?: () => void
}

export const checkIsActualToken = async ({ disconnect }: checkIsActualTokenProps) => {
  if (rootStore.authStore.isHaveToken) {
    if (!rootStore.authStore.isActualAccessToken) {
      if (rootStore.authStore.isActualRefreshToken) {
        void rootStore.authStore.refreshToken()
      } else {
        disconnect?.()
      }
    }
  } else {
    disconnect?.()
  }
}
