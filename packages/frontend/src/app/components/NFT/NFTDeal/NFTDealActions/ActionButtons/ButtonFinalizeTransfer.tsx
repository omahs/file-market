import { type PressEvent } from '@react-types/shared/src/events'
import { type FC } from 'react'

import { type Order } from '../../../../../../swagger/Api'
import { useStores } from '../../../../../hooks'
import { useCurrency } from '../../../../../hooks/useCurrency'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFinalizeTransfer } from '../../../../../processing'
import { type TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { type ActionButtonProps } from './types/types'

export type ButtonFinalizeTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  order?: Order
}

export const ButtonFinalizeTransfer: FC<ButtonFinalizeTransferProps> = ({
  tokenFullId, isDisabled, order,
}) => {
  const { finalizeTransfer, ...statuses } = useFinalizeTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { transferStore } = useStores()
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { toCurrency } = useCurrency()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'The deal is finished!',
    loadingMsg: 'Finalizing the deal',
  })

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={wrapAction(async () => {
          await finalizeTransfer(tokenFullId)
          transferStore.onTransferFinished(BigInt(tokenFullId.tokenId))
        })}
      >
        {toCurrency(BigInt(order?.price ?? '0')) > 0.000001 ? 'Send payment' : 'Finalize the deal'}
      </Button>
    </>
  )
}
