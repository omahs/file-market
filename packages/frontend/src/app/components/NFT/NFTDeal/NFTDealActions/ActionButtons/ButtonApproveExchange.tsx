import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveExchange } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonApproveExchangeProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  onEnd?: () => void
}

export const ButtonApproveExchange: FC<ButtonApproveExchangeProps> = ({
  tokenFullId, isDisabled, onEnd,
}) => {
  const { approveExchange, ...statuses } = useApproveExchange({ ...tokenFullId })
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have approved FileMarket to list your EFT. You can now place an order',
    loadingMsg: 'At first, you need to approve FileMarket to list your EFT. After that you can place an order.',
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
          await approveExchange(tokenFullId)
          onEnd?.()
        })}
      >
        Prepare for sale
      </Button>
    </>
  )
}
