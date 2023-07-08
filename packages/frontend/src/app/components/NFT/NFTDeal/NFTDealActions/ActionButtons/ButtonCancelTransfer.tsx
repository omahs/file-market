import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonCancelTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonCancelTransfer: FC<ButtonCancelTransferProps> = ({
  tokenFullId, isDisabled,
}) => {
  const { cancelTransfer, ...statuses } = useCancelTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer cancelled',
    loadingMsg: 'Cancelling transfer',
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
          await cancelTransfer(tokenFullId)
        })}
      >
        Cancel deal
      </Button>
    </>
  )
}
