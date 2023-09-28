import { useCallback, useState } from 'react'

import { useStatusState, useStores } from '../../../../hooks'
import { useAfterDidMountEffect } from '../../../../hooks/useDidMountEffect'
import { type IProfileSettings } from '../types/formType'

export const useUpdateProfile = (onSuccess?: () => void) => {
  const { userStore } = useStores()
  const [formToTransfer, setFormToTransfer] = useState<IProfileSettings>({
    name: '',
    username: '',
    bio: '',
    email: '',
    isEmailNotificationEnabled: false,
    websiteUrl: '',
    twitter: '',
    telegram: '',
    discord: '',
  })
  const [isEmailUpdated, setIsEmailUpdated] = useState<boolean>(false)
  const { wrapPromise, statuses, setError, setIsLoading } = useStatusState<string, IProfileSettings>()

  const updateEmail = async (email?: string) => {
    await userStore.updateEmail(email)
  }

  const updateProfile = useCallback(wrapPromise(async (props: IProfileSettings) => {
    if (props.email !== userStore.user?.email) {
      await updateEmail(props.email)
      setIsEmailUpdated(true)
    } else setIsEmailUpdated(false)
    await userStore.updateUserInfo(props)
    onSuccess?.()

    return Date.now().toString()
  }), [userStore, onSuccess])

  useAfterDidMountEffect(() => {
    updateProfile(formToTransfer)
  }, [formToTransfer])

  return {
    setError,
    setIsLoading,
    statuses,
    isEmailUpdated,
    updateProfile: (form: IProfileSettings) => {
      setFormToTransfer(form)
    },
    updateEmail,
  }
}
