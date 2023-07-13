/* eslint-disable max-len */
import { useContractEvent } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { IHiddenFilesTokenEventsListener } from '../HiddenFilesTokenEventsListener'
import { HiddenFilesTokenEventNames } from '../types'
import { ensureAddress } from '../utils'

/**
 * Hook called to listen for transfer updates and pass them into TransferStore.
 * @param contractAddress
 * @param listener
 */
export function useWatchHiddenFileTokenEvents(listener: IHiddenFilesTokenEventsListener, contractAddress?: string) {
  // TODO: refactor to use ethers.Provider to also receive tx that caused event emission
  const abi = mark3dConfig.collectionToken.abi
  const address = ensureAddress(contractAddress)
  // Sorry for any type. During one of wagmi updates typing was broken
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferInit,
    listener: (tokenId: any, from: any, to: any, transferNumber: any, block: any) => {
      console.log('onTransferInit')
      console.log(block)
      listener.onTransferInit(tokenId, from, to, block.blockNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraft,
    listener: (tokenId: any, from: any, transferNumber: any, block: any) => {
      console.log('onTransferDraft')
      console.log(transferNumber)
      listener.onTransferDraft(tokenId, from, block.blockNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraftCompletion,
    listener: (tokenId: any, to: any, block: any) => {
      console.log('onTransferDraftCompletion')
      listener.onTransferDraftCompletion(tokenId, to, block.blockNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPublicKeySet,
    listener: (tokenId: any, publicKeyHex: any, block: any) => {
      console.log('onTransferPublicKeySet')
      listener.onTransferPublicKeySet(tokenId, publicKeyHex, block.blockNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPasswordSet,
    listener: (tokenId: any, encryptedPasswordHex: any, block: any) => {
      console.log('onTransferDraft')
      listener.onTransferPasswordSet(tokenId, encryptedPasswordHex, block.blockNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFinished,
    listener: (tokenId: any) => {
      console.log('onTransferFinished')
      listener.onTransferFinished(tokenId)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudReported,
    listener: (tokenId: any, block: any) => {
      console.log('onTransferFraudReported')
      listener.onTransferFraudReported(tokenId, block.blockNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudDecided,
    listener: (tokenId: any, approved: any, block: any) => {
      console.log('onTransferFraudDecided')
      listener.onTransferFraudDecided(tokenId, approved, block.blocNumber)
    },
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferCancellation,
    listener: (tokenId: any, block: any) => {
      console.log('onTransferCancel')
      listener.onTransferCancellation(tokenId, block.blockNumber)
    },
  })
}
