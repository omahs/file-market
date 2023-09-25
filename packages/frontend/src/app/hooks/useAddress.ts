import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { type Params } from '../utils/router'
import { useProfileStore } from './useProfileStore'

export const useAddress = () => {
  const { profileAddress } = useParams<Params>()
  const profileStore = useProfileStore(profileAddress)
  const profileAddressMemo = useMemo(() => {
    if (profileAddress?.[0] === '0' && profileAddress?.[1] === 'x') return profileAddress

    return profileStore.user?.address
  }, [profileAddress, profileStore.user])

  return profileAddressMemo
}
