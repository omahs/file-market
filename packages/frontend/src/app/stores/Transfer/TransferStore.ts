import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'

import { Transfer, TransferStatus } from '../../../swagger/Api'
import { api } from '../../config/api'
import { IHiddenFilesTokenEventsListener } from '../../processing'
import { TokenFullId } from '../../processing/types'
import { normalizeCounterId } from '../../processing/utils/id'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { BlockStore } from '../BlockStore/BlockStore'
import { ErrorStore } from '../Error/ErrorStore'
import { OrderStore } from '../Order/OrderStore'
import { TokenStore } from '../Token/TokenStore'

/**
 * Stores only ACTIVE (i.e. created and not finished/cancelled) transfer state
 */
export class TransferStore implements IStoreRequester,
  IActivateDeactivate<[string, string]>, IHiddenFilesTokenEventsListener {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  isWaitingForEvent: boolean = false
  isWaitingForReciept: boolean = false

  data?: Transfer = undefined
  tokenFullId?: TokenFullId = undefined
  blockStore: BlockStore
  tokenStore: TokenStore
  orderStore: OrderStore

  onTransferFinishedCall?: () => void
  onTransferPublicKeySetCall?: () => void
  constructor({ errorStore, blockStore, tokenStore, orderStore }: {
    errorStore: ErrorStore
    blockStore: BlockStore
    tokenStore: TokenStore
    orderStore: OrderStore }) {
    this.errorStore = errorStore
    this.blockStore = blockStore
    this.tokenStore = tokenStore
    this.orderStore = orderStore
    makeAutoObservable(this, {
      errorStore: false,
      blockStore: false,
      tokenStore: false,
      orderStore: false,
    })
  }

  private request(tokenFullId: TokenFullId, onSuccess?: () => void) {
    storeRequest<Transfer | null>(
      this,
      api.transfers.transfersDetail2(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
      resp => {
        this.data = resp ?? undefined
        if (resp?.block?.number) {
          this.blockStore.setReceiptBlock(BigNumber.from(resp?.block?.number))
        }
        onSuccess?.()
      })
  }

  activate(collectionAddress: string, tokenId: string): void {
    this.isActivated = true
    this.tokenFullId = { collectionAddress, tokenId }
    this.request(this.tokenFullId)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(onSuccess?: () => void): void {
    if (this.tokenFullId) {
      this.request(this.tokenFullId, onSuccess)
    }
  }

  private checkData(tokenId: BigNumber, ifDataOk: (data: Transfer) => void) {
    if (this.data?.tokenId && normalizeCounterId(this.data?.tokenId) === normalizeCounterId(tokenId)) {
      ifDataOk(this.data)
    }
  }

  private checkActivation(tokenId: BigNumber, ifActivationOk: (tokenFullId: TokenFullId) => void) {
    if (
      this.isActivated &&
      this.tokenFullId &&
      normalizeCounterId(this.tokenFullId?.tokenId) === normalizeCounterId(tokenId)
    ) {
      ifActivationOk(this.tokenFullId)
    }
  }

  setOnTransferFinished = (callBack: () => void) => {
    this.onTransferFinishedCall = callBack
  }

  setOnTransferPublicKeySet = (callBack: () => void) => {
    this.onTransferPublicKeySetCall = callBack
  }

  setIsWaitingForEvent = (isWaiting: boolean) => {
    this.isWaitingForEvent = isWaiting
  }

  setIsWaitingReciept = (isWaiting: boolean) => {
    this.isWaitingForReciept = isWaiting
  }

  setBlockTransfer = (transferNumber?: number) => {
    this.data = {
      ...this.data,
      block: {
        ...this.data?.block,
        number: transferNumber,
      },
    }
    this.blockStore.setReceiptBlock(BigNumber.from(transferNumber))
  }

  // We listen to only events related to transfer change, not transfer initialization
  // This store is supposed to be used only on existing transfers (TransferStatus.Drafted or TransferStatus.Created)

  onTransferInit(tokenId: BigNumber, from: string, to: string, transferNumber: number) {
    console.log('onTransferInit')
    this.checkActivation(tokenId, (tokenFullId) => {
      this.data = {
        collection: tokenFullId.collectionAddress,
        tokenId: tokenFullId.tokenId,
        from,
        to,
        statuses: [{
          status: TransferStatus.Created,
          timestamp: Date.now(),
        }],
      }
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
    })
  }

  onTransferDraft(tokenId: BigNumber, from: string, transferNumber: number) {
    console.log('onTransferDraft')
    this.checkActivation(tokenId, (tokenFullId) => {
      this.data = {
        collection: tokenFullId.collectionAddress,
        tokenId: tokenFullId.tokenId,
        from,
        statuses: [{
          status: TransferStatus.Drafted,
          timestamp: Date.now(),
        }],
      }
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
      this.orderStore.reload()
    })
  }

  onTransferDraftCompletion(tokenId: BigNumber, to: string, transferNumber: number) {
    console.log('onTransferCompletion')
    this.checkData(tokenId, data => {
      data.to = to
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
    })
  }

  onTransferPublicKeySet(tokenId: BigNumber, publicKeyHex: string, transferNumber: number) {
    console.log('onTransferPublicKeySet')
    this.checkData(tokenId, data => {
      data.publicKey = publicKeyHex
      data.statuses?.unshift({
        status: TransferStatus.PublicKeySet,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
      this.onTransferPublicKeySetCall?.()
    })
  }

  onTransferPasswordSet(tokenId: BigNumber, encryptedPasswordHex: string, transferNumber: number) {
    console.log('onTransferPasswordSet')
    this.checkData(tokenId, data => {
      data.encryptedPassword = encryptedPasswordHex
      data.statuses?.unshift({
        status: TransferStatus.PasswordSet,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
    })
  }

  onTransferFinished(tokenId: BigNumber) {
    console.log('onTransferFinished')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.setIsWaitingForEvent(false)
      this.tokenStore.reload()
      this.onTransferFinishedCall?.()
    })
  }

  onTransferFraudReported(tokenId: BigNumber, transferNumber: number) {
    console.log('onTransferFraud')
    this.checkData(tokenId, data => {
      data.statuses?.unshift({
        status: TransferStatus.FraudReported,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
    })
  }

  onTransferFraudDecided(tokenId: BigNumber, approved: boolean, transferNumber: number) {
    this.checkData(tokenId, data => {
      data.fraudApproved = approved
      data.statuses?.unshift({
        status: TransferStatus.Finished,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(transferNumber)
    })
  }

  onTransferCancellation(tokenId: BigNumber, transferNumber: number) {
    console.log('onTransferCancel')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.setIsWaitingForEvent(false)
    })
  }

  get isWaitingForContinue() {
    return this.isWaitingForEvent || this.isWaitingForReciept
  }
}
