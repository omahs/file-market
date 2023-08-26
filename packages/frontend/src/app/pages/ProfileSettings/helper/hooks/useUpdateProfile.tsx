import { useState } from 'react'

import { useStatusState, useStores } from '../../../../hooks'
import { useAfterDidMountEffect } from '../../../../hooks/useDidMountEffect'
import { IProfileSettings } from '../types/formType'

export const useUpdateProfile = (onSuccess?: () => void) => {
  const { userStore } = useStores()
  const [formToTransfer, setFormToTransfer] = useState<IProfileSettings>({
    name: '',
    username: '',
    bio: '',
    email: '',
    isEnableEmailNotification: false,
    isEnablePushNotification: false,
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
  })

  const { wrapPromise, statuses, setError, setIsLoading } = useStatusState<void, IProfileSettings>()

  const { error, isLoading, result } = statuses

  const updateProfile = wrapPromise(async (props: IProfileSettings) => {
    console.log('update')
    if (props.email !== userStore.user?.email) {
      await userStore.updateEmail(props.email)
    }
    await userStore.updateUserInfo(props)
    onSuccess?.()
  })

  useAfterDidMountEffect(() => {
    updateProfile(formToTransfer)
  }, [formToTransfer])

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    result,
    updateProfile: (form: IProfileSettings) => {
      console.log('Update2')
      setFormToTransfer(form)
    },
  }
}
