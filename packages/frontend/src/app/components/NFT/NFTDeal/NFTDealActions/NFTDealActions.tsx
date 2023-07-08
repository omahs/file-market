import { Tooltip } from '@nextui-org/react'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { Order, Transfer } from '../../../../../swagger/Api'
import { useStores } from '../../../../hooks'
import { TokenFullId } from '../../../../processing/types'
import { NFTDealActionsBuyer } from './NFTDealActionsBuyer'
import { NFTDealActionOwner } from './NFTDealActionsOwner'

const ButtonsContainer = styled(Tooltip, {
  display: 'flex',
  justifyContent: 'stretch',
  gap: '$3',
  width: '100%',
  flexDirection: 'column',
  padding: '0 16px',
  '@sm': {
    flexDirection: 'column',
    gap: '$3',
  },
})

export interface NFTDealActionsProps {
  tokenFullId: TokenFullId
  order?: Order
  reFetchOrder?: () => void
  transfer?: Transfer
  isOwner?: boolean
  isBuyer?: boolean
  isApprovedExchange?: boolean
  runIsApprovedRefetch: () => void
}

export const NFTDealActions: FC<NFTDealActionsProps> = observer(({
  tokenFullId,
  order,
  transfer,
  isOwner,
  isApprovedExchange,
  isBuyer,
  runIsApprovedRefetch,
}) => {
  const { blockStore, transferStore } = useStores()

  const isDisabled = !blockStore.canContinue || transferStore.isWaitingForContinue

  return (
    <ButtonsContainer content={blockStore.confirmationsText}>
      {isOwner ? (
        <NFTDealActionOwner
          transfer={transfer}
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
          isApprovedExchange={isApprovedExchange}
          runIsApprovedRefetch={runIsApprovedRefetch}
        />
      ) : (
        <NFTDealActionsBuyer
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
          isBuyer={isBuyer}
        />
      )}
    </ButtonsContainer>
  )
})
