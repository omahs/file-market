import { type PressEvent } from '@react-types/shared/src/events'
import { type FC } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelTransfer } from '../../../../../processing'
import { type TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { type ActionButtonProps } from './types/types'

export type ButtonCancelTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonCancelTransfer: FC<ButtonCancelTransferProps> = ({
  tokenFullId, isDisabled,
}) => {
  const { cancelTransfer, ...statuses } = useCancelTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { transferStore } = useStores()
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
          const receipt = await cancelTransfer(tokenFullId)
          if (receipt?.blockNumber) {
            transferStore.onTransferCancellation(BigInt(tokenFullId.tokenId), receipt?.blockNumber)
          }
        })}
      >
        Cancel deal
      </Button>
    </>
  )
}
