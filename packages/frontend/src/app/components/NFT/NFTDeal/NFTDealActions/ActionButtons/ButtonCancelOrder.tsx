import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonCancelOrderProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonCancelOrder: FC<ButtonCancelOrderProps> = ({ tokenFullId, isDisabled }) => {
  const { cancelOrder, ...statuses } = useCancelOrder()
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order cancelled',
    loadingMsg: 'Cancelling order',
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
          await cancelOrder(tokenFullId).catch(e => {
            throw e
          })
        })
        }
      >
        Cancel order
      </Button>
    </>
  )
}
