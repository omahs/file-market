import { PressEvent } from '@react-types/shared/src/events'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

import { useChangeNetwork } from '../../../hooks/useChangeNetwork'
import { useCurrentBlockChain } from '../../../hooks/useCurrentBlockChain'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'
import { Link } from '../../../UIkit'

export interface SwitchNetworkButtonProps {
  onPress?: (e: PressEvent) => void
}

export const SwitchNetworkButton: FC<SwitchNetworkButtonProps> = observer(({ onPress }) => {
  const { changeNetwork, isLoading } = useChangeNetwork()
  const currentBlockChainStore = useCurrentBlockChain()
  const multiChainStore = useMultiChainStore()

  return (
    <Link
      red
      isDisabled={isLoading}
      onPress={(e) => {
        changeNetwork?.(currentBlockChainStore.chainId, true)
        onPress?.(e)
      }}
    >
      Switch chain to
      {' '}
      {multiChainStore.data?.find(item => item.chain.id === currentBlockChainStore.chainId)?.chain.name}
    </Link>
  )
})
