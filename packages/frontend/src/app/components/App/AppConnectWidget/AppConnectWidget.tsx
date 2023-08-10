import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { useAuth } from '../../../hooks/useAuth'
import { useIsConnected } from '../../../hooks/useIsConnected'
import { ConnectButton } from '../../Web3'
import { AppAccountMenu } from '../AppAccountMenu'
import { AppPlusNav } from '../AppPlusNav'

export const AppConnectWidget: FC = observer(() => {
  const { address } = useAccount()
  const isConnected = useIsConnected()
  const { connect } = useAuth()

  if (isConnected && address) {
    return (
      <>
        <AppPlusNav />
        <AppAccountMenu address={address} />
      </>
    )
  } else {
    return (
      <ConnectButton connectFunc={() => {
        connect()
      }}
      />
    )
  }
})
