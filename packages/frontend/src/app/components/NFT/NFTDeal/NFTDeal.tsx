import { observer } from 'mobx-react-lite'
import React, { FC, PropsWithChildren } from 'react'

import { styled } from '../../../../styles'
import { Order, Transfer } from '../../../../swagger/Api'
import { useIsOwner } from '../../../processing'
import { TokenFullId } from '../../../processing/types'
import { PriceBadge, Txt } from '../../../UIkit'
import { formatCurrency, formatUsd } from '../../../utils/web3'
import { NFTDealActions } from './NFTDealActions/NFTDealActions'

export type NFTDealProps = PropsWithChildren<{
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  reFetchOrder?: () => void // currently order is refreshed only when it's created and cancelled
}>

const NFTDealStyle = styled('div', {
  width: '400px',
  background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), #232528',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  gap: '$3',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTB: '$3',
  '@md': {
    width: '100%',
  },
  variants: {
    isNotListed: {
      true: {
        background: 'none',
        height: '64px',
        padding: '0',
      },
    },
  },
})

const DealContainerInfo = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '$3',
  padding: '0 16px',
  '@sm': {
    flexDirection: 'column',
  },
})

const ButtonsContainer = styled('div', {
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

const IsNotListedContainer = styled('div', {
  width: '100%',
  height: '100%',
  border: '1px solid $gray300',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'not-allowed',
})

export const NFTDeal: FC<NFTDealProps> = observer(({
  transfer,
  order,
  tokenFullId,
  reFetchOrder,
  children,
}) => {
  const { isOwner } = useIsOwner(tokenFullId)

  return (
    <NFTDealStyle isNotListed={!transfer && !isOwner}>
      {(children || order) && (
        <DealContainerInfo>
          {children}
          {order && (
            <PriceBadge
              title="Price"
              left={formatCurrency(order.price ?? 0)}
              right={`~${formatUsd(order.priceUsd ?? 0)}`}
              size='lg'
              background='secondary'
            />
          )}
        </DealContainerInfo>
      )}
      <ButtonsContainer>
        <NFTDealActions
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          reFetchOrder={reFetchOrder}
        />
      </ButtonsContainer>
      {(!transfer && !isOwner) && (
        <IsNotListedContainer>
          <Txt primary1 style={{ fontSize: '24px', color: '#A7A8A9' }}> EFT is not listed</Txt>
        </IsNotListedContainer>
      )}
    </NFTDealStyle>
  )
})
