import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { Order, Transfer } from '../../../../../swagger/Api'
import { TokenFullId } from '../../../../processing/types'
import { Button } from '../../../../UIkit'
import { transferPermissions } from '../../../../utils/transfer/status'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonFulfillOrder } from './ActionButtons/ButtonFulfillOrder'
import { ButtonReportFraudTransfer } from './ActionButtons/ButtonReportFraudTransfer'
import { ButtonSetPublicKeyTransfer } from './ActionButtons/ButtonSetPublicKeyTransfer'
import { HideAction } from './HideAction'

export interface NFTDealActionsBuyerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  isDisabled?: boolean
  isBuyer?: boolean
}

const permissions = transferPermissions.buyer

export const NFTDealActionsBuyer: FC<NFTDealActionsBuyerProps> = observer(({
  transfer,
  order,
  tokenFullId,
  isDisabled,
  isBuyer,
}) => {
  return (
    <>
      <HideAction hide={!isBuyer || !transfer || !permissions.canWaitSeller(transfer)}>
        <Button
          primary
          fullWidth
          borderRadiusSecond
          isDisabled
        >
          Waiting for seller
        </Button>
      </HideAction>
      <HideAction hide={!transfer || !permissions.canFulfillOrder(transfer)}>
        <ButtonFulfillOrder
          tokenFullId={tokenFullId}
          order={order}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canSetPublicKey(transfer)}>
        <ButtonSetPublicKeyTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canFinalize(transfer)}>
        <ButtonFinalizeTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
          order={order}
        />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canReportFraud(transfer)}>
        <ButtonReportFraudTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canCancel(transfer)}>
        <ButtonCancelTransfer
          tokenFullId={tokenFullId}
          isDisabled={isDisabled}
        />
      </HideAction>
    </>
  )
})
