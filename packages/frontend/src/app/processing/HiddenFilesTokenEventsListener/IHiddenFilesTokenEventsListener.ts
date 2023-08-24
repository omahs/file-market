import { BigNumber } from 'ethers'

export interface IHiddenFilesTokenEventsListener {

  onTransferInit: (tokenId: BigNumber, from: string, to: string, block: any) => void

  onTransferDraft: (tokenId: BigNumber, from: string, block: any) => void

  onTransferDraftCompletion: (tokenId: BigNumber, to: string, block: any) => void

  onTransferPublicKeySet: (tokenId: BigNumber, publicKeyHex: string, block: any) => void

  onTransferPasswordSet: (tokenId: BigNumber, encryptedPasswordHex: string, block: any) => void

  onTransferFinished: (tokenId: BigNumber) => void

  onTransferFraudReported: (tokenId: BigNumber, block: any) => void

  onTransferFraudDecided: (tokenId: BigNumber, approved: boolean, block: any) => void

  onTransferCancellation: (tokenId: BigNumber, block: any) => void
}
