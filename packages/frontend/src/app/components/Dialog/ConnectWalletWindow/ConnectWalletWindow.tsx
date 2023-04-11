import { Modal } from '@nextui-org/react'
import { ModalTitle } from '../../Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { styled } from '../../../../styles'
import { Button, ToolCard, Txt } from '../../../UIkit'
import React from 'react'
import { ToolCardContent, ToolCardInfo, ToolTitle, ToolDescription } from '../../../pages/MainPage/Blocks/WelcomeBlock'
import { EnterSeedPhraseWindow } from '../EnterSeedPhraseWindow/EnterSeedPhraseWindow'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../../hooks'
import { CreatedMnemonicWindow } from '../CreatedMnemonicWindow/CreatedMnemonicWindow'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useDisconnectAndLogout } from '../../../hooks/useDisconnectAndLogout'

const ConnectWalletWindowContentStyle = styled('div', {
  fontSize: '12px',
  '& .headText': {
    textAlign: 'center',
    paddingBottom: '1em'
  },
  '& .mainContent': {
    display: 'flex',
    '& svg': {
      width: '8.33em',
      height: '8.33em'
    },
    justifyContent: 'center',
    gap: '1em',
    '& button': {
      background: 'white'
    }
  },
  paddingBottom: '2em',
  '@md': {
    fontSize: '10px'
  },
  '@sm': {
    '& .mainContent': {
      fontSize: '8px',
      flexDirection: 'column'
    }
  }
})

const ConnectWalletWindowStyle = styled('div', {
  background: 'red',
  '& .nextui-backdrop-content': {
    maxWidth: 'inherit'
  }
})

const ToolCardConnectWallet = styled(ToolCard, {
  width: '29em',
  '@sm': {
    width: '100%'
  }
})

const ToolCardContentWallet = styled(ToolCardContent, {
  '@sm': {
    minHeight: '250px'
  }
})

export const ConnectWalletWindow = observer(({ open, onClose }: AppDialogProps<{}>) => {
  const { disconnect } = useDisconnectAndLogout()
  const { dialogStore } = useStores()
  const { adaptive } = useMediaMui()
  const openImportAccountDialog = () => {
    dialogStore.openDialog({
      component: EnterSeedPhraseWindow,
      props: {}
    })
  }

  const openCreatedMnemonicDialog = () => {
    dialogStore.openDialog({
      component: CreatedMnemonicWindow,
      props: {}
    })
  }

  return (
        <ConnectWalletWindowStyle>
            <Modal
                closeButton
                open={open}
                onClose={() => {
                  disconnect()
                  onClose()
                }}
                width={adaptive({
                  sm: '400px',
                  md: '650px',
                  lg: '950px',
                  defaultValue: 'inherit'
                })}
            >
                <ModalTitle>Sign in</ModalTitle>
                <Modal.Body>
                    <ConnectWalletWindowContentStyle>
                        <div className="headText">
                            <Txt h3>Create or Import Account</Txt>
                        </div>
                        <div className="mainContent">
                            <div className="section">
                                <ToolCardConnectWallet>
                                    <ToolCardContentWallet>
                                        <ToolCardInfo>
                                            <ToolTitle style={{ textAlign: 'center' }}>Create Account</ToolTitle>
                                            <ToolDescription style={{ textAlign: 'center' }}>
                                                Create a new account
                                            </ToolDescription>
                                        </ToolCardInfo>
                                        <Button onClick={() => {
                                          openCreatedMnemonicDialog()
                                        }}>
                                            Create
                                        </Button>
                                    </ToolCardContentWallet>
                                </ToolCardConnectWallet>
                            </div>
                            <div className="section">
                                    <ToolCardConnectWallet>
                                        <ToolCardContentWallet>
                                            <ToolCardInfo>
                                                <ToolTitle style={{ textAlign: 'center' }}>Import Account</ToolTitle>
                                                <ToolDescription style={{ textAlign: 'center' }}>
                                                    Import your account using the seed phrase
                                                    received during registration
                                                </ToolDescription>
                                            </ToolCardInfo>
                                            <Button onClick={() => {
                                              openImportAccountDialog()
                                            }}>
                                                Import
                                            </Button>
                                        </ToolCardContentWallet>
                                    </ToolCardConnectWallet>
                            </div>
                        </div>
                    </ConnectWalletWindowContentStyle>
                </Modal.Body>
            </Modal>
        </ConnectWalletWindowStyle>
  )
})
