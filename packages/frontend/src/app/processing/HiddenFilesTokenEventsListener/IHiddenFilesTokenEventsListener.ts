export interface IHiddenFilesTokenEventsListener {

  onTransferInit: (tokenId: bigint, from: string, to: string, block: any) => void

  onTransferDraft: (tokenId: bigint, from: string, block: any) => void

  onTransferDraftCompletion: (tokenId: bigint, to: string, block: any) => void

  onTransferPublicKeySet: (tokenId: bigint, publicKeyHex: string, block: any) => void

  onTransferPasswordSet: (tokenId: bigint, encryptedPasswordHex: string, block: any) => void

  onTransferFinished: (tokenId: bigint) => void

  onTransferFraudReported: (tokenId: bigint, block: any) => void

  onTransferFraudDecided: (tokenId: bigint, approved: boolean, block: any) => void

  onTransferCancellation: (tokenId: bigint, block: any) => void
}
