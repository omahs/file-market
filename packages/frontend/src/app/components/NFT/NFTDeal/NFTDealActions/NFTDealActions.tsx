import { Tooltip } from '@nextui-org/react'
import { utils } from 'ethers'
import { observer } from 'mobx-react-lite'
import React, { FC, useMemo } from 'react'

import { styled } from '../../../../../styles'
import { Order, Transfer } from '../../../../../swagger/Api'
import { useStores } from '../../../../hooks'
import { useConfig } from '../../../../hooks/useConfig'
import { TokenFullId } from '../../../../processing/types'
import { transferPermissions } from '../../../../utils/transfer/status'
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

const permissions = transferPermissions.buyer

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
  const config = useConfig()
  const collectionAddressNormalized = tokenFullId?.collectionAddress && utils.getAddress(tokenFullId?.collectionAddress)
  const fileBunniesAddressNormalized = utils.getAddress(config?.fileBunniesCollectionToken.address ?? '')
  const isFileBunnies = collectionAddressNormalized === fileBunniesAddressNormalized
  const fileBunniesText = useMemo(() => {
    return (isFileBunnies && (!transfer || permissions.canFulfillOrder(transfer))) ? (+tokenFullId.tokenId >= 7000 ? 'The secondary market will open on August 28th' : 'Unlocked 24.12.2023') : ''
  }, [isFileBunnies, transfer, tokenFullId])

  const isDisabledFileBunnies = useMemo(() => {
    return isFileBunnies && (!transfer || permissions.canFulfillOrder(transfer))
  }, [isFileBunnies, transfer])

  return (
    <ButtonsContainer content={fileBunniesText ?? blockStore.confirmationsText}>
      {isOwner ? (
        <NFTDealActionOwner
          transfer={transfer}
          tokenFullId={tokenFullId}
          isDisabled={isDisabled || isDisabledFileBunnies}
          isApprovedExchange={isApprovedExchange}
          runIsApprovedRefetch={runIsApprovedRefetch}
        />
      ) : (
        <NFTDealActionsBuyer
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          isBuyer={isBuyer}
          isDisabled={isDisabled || isDisabledFileBunnies}
        />
      )}
    </ButtonsContainer>
  )
})
