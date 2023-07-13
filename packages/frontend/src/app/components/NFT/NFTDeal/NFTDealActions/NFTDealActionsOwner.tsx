import { utils } from 'ethers'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { Transfer } from '../../../../../swagger/Api'
import { mark3dConfig } from '../../../../config/mark3d'
import { TokenFullId } from '../../../../processing/types'
import { Button } from '../../../../UIkit'
import { transferPermissions } from '../../../../utils/transfer/status'
import { ButtonApproveExchange } from './ActionButtons/ButtonApproveExchange'
import { ButtonApproveTransfer } from './ActionButtons/ButtonApproveTransfer'
import { ButtonCancelOrder } from './ActionButtons/ButtonCancelOrder'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonInitTransfer } from './ActionButtons/ButtonInitTransfer'
import { ButtonPlaceOrder } from './ActionButtons/ButtonPlaceOrder'
import { HideAction } from './HideAction'

export interface NFTDealActionsOwnerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  isDisabled?: boolean
  isApprovedExchange?: boolean
  runIsApprovedRefetch: () => void
}

const permissions = transferPermissions.owner

export const NFTDealActionOwner: FC<NFTDealActionsOwnerProps> = observer(({
  transfer,
  tokenFullId,
  isDisabled,
  isApprovedExchange,
  runIsApprovedRefetch,
}) => {
  const collectionAddressNormalized = tokenFullId?.collectionAddress && utils.getAddress(tokenFullId?.collectionAddress)
  const fileBunniesAddressNormalized = utils.getAddress(mark3dConfig.fileBunniesCollectionToken.address)
  const isFileBunnies = collectionAddressNormalized === fileBunniesAddressNormalized

  return (
    <>
      <HideAction hide={!transfer || !permissions.canWaitBuyer(transfer)}>
        <Button
          primary
          fullWidth
          borderRadiusSecond
          isDisabled
        >
          Waiting for buyer
        </Button>
      </HideAction>
      <HideAction hide={!transfer || !permissions.canApprove(transfer)}>
        <ButtonApproveTransfer
          tokenFullId={tokenFullId}
          transfer={transfer}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canFinalize(transfer)}>
        <ButtonFinalizeTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancelOrder(transfer)}>
        <ButtonCancelOrder
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancel(transfer)}>
        <ButtonCancelTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!!transfer || !isApprovedExchange || isFileBunnies}>
        <ButtonPlaceOrder
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!!transfer || isApprovedExchange || isFileBunnies}>
        <ButtonApproveExchange
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
          onEnd={() => { runIsApprovedRefetch() }}
        />
      </HideAction>
      <HideAction hide={!!transfer || isFileBunnies}>
        <ButtonInitTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
    </>
  )
})
