import { BigNumber } from 'ethers'
import { observer } from 'mobx-react-lite'
import React, { FC, PropsWithChildren, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { Order } from '../../../../swagger/Api'
import { useChangeNetwork } from '../../../hooks/useChangeNetwork'
import { useCurrency } from '../../../hooks/useCurrency'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'
import { TokenFullId } from '../../../processing/types'
import { Button, PriceBadge } from '../../../UIkit'
import { Params } from '../../../utils/router'
import NftDealContainer from './NFTDealContainer/NFTDealContainer'

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

export const NFTDeal: FC<NFTDealProps> = observer(({
  order,
  tokenFullId,
  reFetchOrder,
  children,
}) => {
  const { formatCurrency, formatUsd } = useCurrency()
  const { isConnected } = useAccount()
  const { chain, changeNetwork } = useChangeNetwork()
  const { chainName } = useParams<Params>()
  const multiChainStore = useMultiChainStore()

  const isNetworkIncorrect = useMemo(() => {
    return chain?.name !== chainName
  }, [chain, chainName])

  return (
    <NFTDealStyle>
      {(children || order) && (
        <DealContainerInfo>
          {children}
          {order && (
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
      { (!isNetworkIncorrect) ? (
        <NftDealContainer
          tokenFullId={tokenFullId}
          order={order}
          reFetchOrder={reFetchOrder}
          isNetworkIncorrect={isNetworkIncorrect}
          chainName={chainName}
        />
      )
        : (
          <DealContainerInfo>
            <Button
              primary
              fullWidth
              borderRadiusSecond
              onPress={() => { changeNetwork(multiChainStore.getChainByName(chainName)?.chain.id) }}
            >
              {isConnected ? `Switch network to ${chainName}` : 'Connect wallet'}
            </Button>
          </DealContainerInfo>
        )}
    </NFTDealStyle>
  )
})
