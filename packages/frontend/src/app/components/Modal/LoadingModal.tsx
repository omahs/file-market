import React from 'react'

import { Modal } from '../../UIkit/Modal/Modal'
import { type DialogProps } from '../../utils/dialog'
import { type InProcessBodyProps, InProgressBody } from './Modal'

export const LoadingModal = ({
  onClose,
  open,
  text,
}: InProcessBodyProps & DialogProps) => {
  return (
    <Modal
      aria-labelledby='modal-title'
      open={open}
      width={'max-content'}
      style={{
        maxWidth: '690px',
      }}
      preventClose
      onClose={onClose}
    >
      <InProgressBody text={text} />
    </Modal>
  )
}
