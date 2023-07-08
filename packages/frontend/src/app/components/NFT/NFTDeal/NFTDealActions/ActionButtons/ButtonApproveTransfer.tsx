import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'

import { Transfer } from '../../../../../../swagger/Api'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonApproveTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  transfer?: Transfer
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({
  tokenFullId, transfer, isDisabled,
}) => {
  const { approveTransfer, ...statuses } = useApproveTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have granted hidden file access to the buyer',
    loadingMsg: 'Sending an encrypted encryption password',
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
          await approveTransfer({
            tokenId: tokenFullId.tokenId,
            publicKey: transfer?.publicKey,
          }).catch(e => {
            console.assert(e)
            throw e
          })
        })}
      >
        Transfer hidden file
      </Button>
    </>
  )
}
