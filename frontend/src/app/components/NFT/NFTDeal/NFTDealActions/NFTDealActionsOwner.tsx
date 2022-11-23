import { Transfer } from '../../../../../swagger/Api'
import { TokenFullId } from '../../../../processing/types'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { ButtonInitTransfer } from './ActionButtons/ButtonInitTransfer'
import { useIsApprovedExchange } from '../../../../processing/hooks/useIsApprovedExchange'
import { Txt } from '../../../../UIkit'
import { stringifyError } from '../../../../utils/error'
import { ButtonApproveExchange } from './ActionButtons/ButtonApproveExchange'
import { ButtonPlaceOrder } from './ActionButtons/ButtonPlaceOrder'
import { transferPermissions } from '../../../../utils/transfer/status'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonApproveTransfer } from './ActionButtons/ButtonApproveTransfer'

export interface NFTDealActionsOwnerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  reFetchOrder?: () => void // caveat, there are no contract events on order placement
  ownerStatusChanged?: () => void
}

const permissions = transferPermissions.owner

export const NFTDealActionOwner: FC<NFTDealActionsOwnerProps> = observer(({
  transfer,
  tokenFullId,
  reFetchOrder,
  ownerStatusChanged
}) => {
  const { isApprovedExchange, error: isApprovedExchangeError, refetch } = useIsApprovedExchange(tokenFullId)
  const error = isApprovedExchangeError
  if (error) {
    return (
      <Txt color="red">
        {stringifyError(error)}
      </Txt>
    )
  }
  if (transfer) {
    console.log('transfer', transfer)
    return (
     <>
       {permissions.canApprove(transfer) && (
         <ButtonApproveTransfer tokenFullId={tokenFullId}/>
       )}
       {permissions.canFinalize(transfer) && (
         <ButtonFinalizeTransfer tokenFullId={tokenFullId} callback={ownerStatusChanged}/>
       )}
       {permissions.canCancel(transfer) && (
         <ButtonCancelTransfer tokenFullId={tokenFullId}/>
       )}
     </>
    )
  }
  if (isApprovedExchange) {
    return <ButtonPlaceOrder tokenFullId={tokenFullId} callback={reFetchOrder}/>
  }
  return (
    <>
      <ButtonInitTransfer tokenFullId={tokenFullId}/>
      <ButtonApproveExchange
        tokenFullId={tokenFullId}
        callback={refetch}
      />
    </>
  )
})
