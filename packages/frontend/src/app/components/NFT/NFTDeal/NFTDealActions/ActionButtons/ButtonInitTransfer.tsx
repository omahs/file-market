import { Modal } from '@nextui-org/react'
import { type FC } from 'react'

import { useStores } from '../../../../../hooks'
import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useInitTransfer } from '../../../../../processing'
import { type TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { ModalTitle } from '../../../../../UIkit/Modal/Modal'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { TransferForm, type TransferFormValue } from '../../TransferForm'
import { type ActionButtonProps } from './types/types'

export type ButtonInitTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonInitTransfer: FC<ButtonInitTransferProps> = ({
  tokenFullId, isDisabled,
}) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { initTransfer, ...statuses } = useInitTransfer(tokenFullId)
  const { isLoading } = statuses
  const { transferStore } = useStores()
  const { wrapAction } = wrapButtonActionsFunction<TransferFormValue>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer initialized. Recipient should now accept it.',
    loadingMsg: 'Initializing transfer',
  })

  return (
    <>
      <Modal
        closeButton
        open={modalOpen}
        onClose={closeModal}
      >
        <ModalTitle>Gift</ModalTitle>
        <Modal.Body>
          <TransferForm
            onSubmit={wrapAction(async (form) => {
              closeModal()
              const receipt = await initTransfer({
                tokenId: tokenFullId.tokenId,
                to: form.address,
              })
              if (receipt?.blockNumber) {
                transferStore.onTransferDraft(BigInt(tokenFullId.tokenId), receipt.from, BigInt(receipt?.blockNumber ?? 0))
              }
            })}
          />
        </Modal.Body>
      </Modal>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={openModal}
      >
        Gift
      </Button>
    </>
  )
}
