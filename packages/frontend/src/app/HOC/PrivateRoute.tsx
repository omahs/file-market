import { observer } from 'mobx-react-lite'
import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { useStores } from '../hooks'
import Loading from '../pages/Loading/Loading'

const PrivateRouteJwt = observer(() => {
  const { authStore } = useStores()
  const { isConnected, address } = useAccount()

  if (authStore.isLoading || authStore.requestCount === 0) {
    return <Loading />
  }
  if (authStore.isAuth) {
    return <Outlet />
  } else if (isConnected) {
    return <Navigate to={`/profile/${address}`} />
  } else {
    return <Navigate to={'/main'} />
  }
})

export default PrivateRouteJwt
