import { useCallback, useState } from 'react'

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

  const { wrapPromise, statuses, setError, setIsLoading } = useStatusState<string, IProfileSettings>()

  const updateProfile = useCallback(wrapPromise(async (props: IProfileSettings) => {
    console.log('update')
    if (props.email !== userStore.user?.email) {
      await userStore.updateEmail(props.email)
    }
    await userStore.updateUserInfo(props)
    onSuccess?.()

    return 'vse good'
  }), [userStore, onSuccess])

  useAfterDidMountEffect(() => {
    updateProfile(formToTransfer)
  }, [formToTransfer])

  return {
    setError,
    setIsLoading,
    statuses,
    updateProfile: (form: IProfileSettings) => {
      console.log('Update2')
      setFormToTransfer(form)
    },
  }
}
