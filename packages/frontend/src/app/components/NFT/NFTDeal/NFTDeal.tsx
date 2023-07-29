import { BigNumber } from 'ethers'
import { observer } from 'mobx-react-lite'
import React, { FC, PropsWithChildren } from 'react'

import { styled } from '../../../../styles'
import { Order } from '../../../../swagger/Api'
import { useCurrency } from '../../../hooks/useCurrency'
import { useStatusModal } from '../../../hooks/useStatusModal'
import { useWatchStatusesTransfer } from '../../../processing/nft-interaction/useWatchStatusesTransfer'
import { TokenFullId } from '../../../processing/types'
import { PriceBadge, Txt } from '../../../UIkit'
import { LoadingOpacity } from '../../../UIkit/Loading/LoadingOpacity'
import BaseModal from '../../Modal/Modal'
import { NFTDealActions } from './NFTDealActions/NFTDealActions'

export type NFTDealProps = PropsWithChildren<{
  tokenFullId: TokenFullId
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
  order,
  tokenFullId,
  reFetchOrder,
  children,
}) => {
  const { isOwner, isApprovedExchange, isLoading, error, transfer, isBuyer, runIsApprovedRefetch } = useWatchStatusesTransfer({ tokenFullId })
  const { formatCurrency, formatUsd } = useCurrency()
  const { modalProps } = useStatusModal({
    statuses: { result: undefined, isLoading: false, error: error as unknown as string },
    okMsg: '',
    loadingMsg: '',
  })

  if (error) {
    return <BaseModal {...modalProps} />
  }

  return (
    <NFTDealStyle isNotListed={!transfer && !isOwner}>
      <LoadingOpacity isLoading={isLoading}>
        {(children || transfer) && (
          <DealContainerInfo>
            {children}
            {transfer && (
              <PriceBadge
                title="Price"
                left={formatCurrency(BigNumber.from(order?.price ?? 0))}
                right={`~${formatUsd(order?.priceUsd ?? '')}`}
                size='lg'
                background='secondary'
              />
            )}
          </DealContainerInfo>
        )}
        <NFTDealActions
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          reFetchOrder={reFetchOrder}
          isOwner={isOwner}
          isBuyer={isBuyer}
          isApprovedExchange={isApprovedExchange}
          runIsApprovedRefetch={runIsApprovedRefetch}
        />
        {(!transfer && !isOwner) && (
          <IsNotListedContainer>
            <Txt primary1 style={{ fontSize: '24px', color: '#A7A8A9' }}> EFT is not listed</Txt>
          </IsNotListedContainer>
        )}
      </LoadingOpacity>
    </NFTDealStyle>
  )
})
