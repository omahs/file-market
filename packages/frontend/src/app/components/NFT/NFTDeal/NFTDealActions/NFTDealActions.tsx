import { Tooltip } from '@nextui-org/react'
import { utils } from 'ethers'
import { observer } from 'mobx-react-lite'
import React, { FC, useMemo } from 'react'
import { transferPermissions } from '../../../../utils/transfer/status'
import { styled } from '../../../../../styles'
import { Order, Transfer } from '../../../../../swagger/Api'
import { mark3dConfig } from '../../../../config/mark3d'
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

  const collectionAddressNormalized = tokenFullId?.collectionAddress && utils.getAddress(tokenFullId?.collectionAddress)
  const fileBunniesAddressNormalized = utils.getAddress(mark3dConfig.fileBunniesCollectionToken.address)
  const isFileBunnies = collectionAddressNormalized === fileBunniesAddressNormalized
const permission = status.buyer
  const fileBunniesText = useMemo(() => {
    return isFileBunnies && (!transfer || permissions.canFinalize(transfer)) ? (+tokenFullId.tokenId >= 7000 ? 'The secondary market will open on August 28th' : 'Unlocked 23.12.2023') : ''
  }, [isFileBunnies, transfer, tokenFullId])

  const isDisabledFileBunnies = useMemo(() => {
    return isFileBunnies && (!transfer || permissions.canFinalize(transfer))
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
          isDisabled={isDisabled}
          isBuyer={isBuyer}
        />
      )}
    </ButtonsContainer>
  )
})
