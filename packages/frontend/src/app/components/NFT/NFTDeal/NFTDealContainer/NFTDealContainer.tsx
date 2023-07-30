import React, { PropsWithChildren } from 'react'

import { styled } from '../../../../../styles'
import { Order } from '../../../../../swagger/Api'
import { useStatusModal } from '../../../../hooks/useStatusModal'
import { useWatchStatusesTransfer } from '../../../../processing/nft-interaction/useWatchStatusesTransfer'
import { TokenFullId } from '../../../../processing/types'
import { Txt } from '../../../../UIkit'
import { LoadingOpacity } from '../../../../UIkit/Loading/LoadingOpacity'
import BaseModal from '../../../Modal/Modal'
import { NFTDealActions } from '../NFTDealActions/NFTDealActions'

type NFTDealContainerProps = PropsWithChildren<{
  tokenFullId: TokenFullId
  order?: Order
  reFetchOrder?: () => void // currently order is refreshed only when it's created and cancelled
  isNetworkIncorrect?: boolean
  chainName?: string
}>

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

const NftDealContainer = ({
  tokenFullId,
  order,
  reFetchOrder,
  isNetworkIncorrect,
}: NFTDealContainerProps) => {
  const { isOwner, isApprovedExchange, isLoading, error, transfer, isBuyer, runIsApprovedRefetch } = useWatchStatusesTransfer({ tokenFullId, isNetworkIncorrect })
  const { modalProps } = useStatusModal({
    statuses: { result: undefined, isLoading: false, error: error as unknown as string },
    okMsg: '',
    loadingMsg: '',
  })
  if (error) {
    return <BaseModal {...modalProps} />
  }

  return (
    <LoadingOpacity isLoading={isLoading}>
      <>
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
      </>
      {(!transfer && !isOwner) && (
        <IsNotListedContainer>
          <Txt primary1 style={{ fontSize: '24px', color: '#A7A8A9' }}> EFT is not listed</Txt>
        </IsNotListedContainer>
      )}
    </LoadingOpacity>
  )
}

export default NftDealContainer
