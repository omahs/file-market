import { useState } from 'react'

import { useStatusState } from '../../../../hooks'
import { useAfterDidMountEffect } from '../../../../hooks/useDidMountEffect'
import { wrapRequest } from '../../../../utils/error/wrapRequest'
import { IProfileSettings } from '../types/formType'

export const useUpdateProfile = () => {
  const [formToTransfer, setFormToTransfer] = useState<IProfileSettings>({
    name: '',
    url: '',
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
    // @ts-expect-error
    await wrapRequest(() => {
      return new Promise(() => {
        console.log(props)
      })
    })
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
      setFormToTransfer(form)
    },
  }
}
