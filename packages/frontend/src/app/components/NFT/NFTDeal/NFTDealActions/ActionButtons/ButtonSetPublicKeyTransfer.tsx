import { PressEvent } from '@react-types/shared/src/events'
import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useSetPublicKey } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonSetPublicKeyTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonSetPublicKeyTransfer: FC<ButtonSetPublicKeyTransferProps> = ({
  tokenFullId,
  isDisabled,
}) => {
  const { setPublicKey, ...statuses } = useSetPublicKey({ ...tokenFullId })
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Public key was sent. The owner can now give you access to the hidden file.',
    loadingMsg: 'Sending keys, so owner could encrypt the file password and transfer it to you',
  })

  const onPress = wrapAction(async () => {
    await setPublicKey(tokenFullId).catch(e => {
      throw e
    })
  })

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={onPress}
      >
        Accept transfer
      </Button>
    </>
  )
}
