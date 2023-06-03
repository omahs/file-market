import { observer } from 'mobx-react-lite'
import React from 'react'

import { styled } from '../../../../styles'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { FWIcon, Modal, ModalBody, ModalTitle } from '../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { UnlockSection } from '../ConnectFileWalletDialog/sections/UnlockSection'

const ConnectWalletWindowStyle = styled('div', {
  background: 'red',
  '& .nextui-backdrop-content': {
    maxWidth: 'inherit',
  },
})

export const UnlockFWDialog = observer(({ open, onClose }: AppDialogProps<{}>) => {
  useCloseIfNotConnected(onClose)
  const { adaptive } = useMediaMui()

  return (
    <ConnectWalletWindowStyle>
      <Modal
        closeButton
        open={open}
        width={adaptive({
          sm: '400px',
          md: '650px',
          lg: '664px',
          defaultValue: '664px',
        })}
        onClose={onClose}
      >
        <ModalTitle style={{ marginBottom: '0' }}>
          {' '}
          <FWIcon />
          {' '}
          Connect FileWallet
        </ModalTitle>
        <ModalBody style={{ paddingBottom: 0 }}>
          <UnlockSection onSuccess={() => {
            onClose()
          }}
          />
        </ModalBody>
      </Modal>
    </ConnectWalletWindowStyle>
  )
})