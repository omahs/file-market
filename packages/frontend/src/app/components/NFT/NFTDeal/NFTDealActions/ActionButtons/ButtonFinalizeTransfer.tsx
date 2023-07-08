import { PressEvent } from '@react-types/shared/src/events'
import { BigNumber } from 'ethers'
import { FC } from 'react'

import { Order } from '../../../../../../swagger/Api'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFinalizeTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { toCurrency } from '../../../../../utils/web3'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonFinalizeTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  order?: Order
}

export const ButtonFinalizeTransfer: FC<ButtonFinalizeTransferProps> = ({
  tokenFullId, isDisabled, order,
}) => {
  const { finalizeTransfer, ...statuses } = useFinalizeTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
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
          await finalizeTransfer(tokenFullId).catch(e => {
            throw e
          })
        })}
      >
        {toCurrency(BigNumber.from(order?.price ?? '0')) > 0.000001 ? 'Send payment' : 'Finalize the deal'}
      </Button>
    </>
  )
}
