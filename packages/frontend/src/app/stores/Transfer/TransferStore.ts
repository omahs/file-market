import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'

import { Api, Transfer, TransferStatus } from '../../../swagger/Api'
import { IHiddenFilesTokenEventsListener } from '../../processing'
import { TokenFullId } from '../../processing/types'
import { normalizeCounterId } from '../../processing/utils/id'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { BlockStore } from '../BlockStore/BlockStore'
import { ErrorStore } from '../Error/ErrorStore'
import { MultiChainStore } from '../MultiChain/MultiChainStore'
import { OrderStore } from '../Order/OrderStore'
import { TokenStore } from '../Token/TokenStore'

/**
 * Stores only ACTIVE (i.e. created and not finished/cancelled) transfer state
 */
export class TransferStore implements IStoreRequester,
  IActivateDeactivate<[string, string, string]>, IHiddenFilesTokenEventsListener {
  errorStore: ErrorStore
  multiChainStore: MultiChainStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  isWaitingForEvent: boolean = false
  isWaitingForReciept: boolean = false

  data?: Transfer = undefined
  tokenFullId?: TokenFullId = undefined
  api?: Api<{}>
  blockStore: BlockStore
  tokenStore: TokenStore
  orderStore: OrderStore

  isCustomApi: boolean = true

  onTransferFinishedCall?: () => void
  onTransferPublicKeySetCall?: () => void
  onTransferDraftCall?: () => void
  onTransferCancelCall?: () => void
  constructor({ errorStore, blockStore, tokenStore, orderStore, multiChainStore }: {
    errorStore: ErrorStore
    blockStore: BlockStore
    tokenStore: TokenStore
    orderStore: OrderStore
    multiChainStore: MultiChainStore
  }) {
    this.errorStore = errorStore
    this.blockStore = blockStore
    this.tokenStore = tokenStore
    this.orderStore = orderStore
    this.multiChainStore = multiChainStore
    makeAutoObservable(this, {
      errorStore: false,
      blockStore: false,
      tokenStore: false,
      orderStore: false,
      multiChainStore: false,
    })
  }

  private request(tokenFullId: TokenFullId, api?: Api<{}>, onSuccess?: () => void) {
    if (!api) return
    console.log('REQUESTT')
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

  activate(collectionAddress: string, tokenId: string, chainName: string): void {
    this.isActivated = true
    this.tokenFullId = { collectionAddress, tokenId }
    this.api = this.multiChainStore.getApiByName(chainName)
    this.request(this.tokenFullId, this.api)
    console.log('ACTIVVVVEAT')
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
      this.request(this.tokenFullId, this.api, onSuccess)
    }
    console.log('Reload')
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

  private checkExistStatus (status: TransferStatus): boolean {
    for (let i = 0; i < (this.data?.statuses?.length ?? 0); i++) {
      if (this.data?.statuses?.[i].status === status) return true
    }

    return false
  }

  setOnTransferFinished = (callBack: () => void) => {
    this.onTransferFinishedCall = callBack
  }

  setOnTransferPublicKeySet = (callBack: () => void) => {
    this.onTransferPublicKeySetCall = callBack
  }

  setOnTransferDrafted = (callBack: () => void) => {
    this.onTransferDraftCall = callBack
  }

  setOnTransferCancel = (callBack: () => void) => {
    this.onTransferCancelCall = callBack
  }

  setIsWaitingForEvent = (isWaiting: boolean) => {
    this.isWaitingForEvent = isWaiting
  }

  setIsWaitingReciept = (isWaiting: boolean) => {
    this.isWaitingForReciept = isWaiting
  }

  setBlockTransfer = (blockNumber?: number) => {
    if (this.data?.block) {
      this.data.block.number = blockNumber
    }
    this.blockStore.setReceiptBlock(BigNumber.from(blockNumber))
  }

  setData = (transfer?: Transfer) => {
    this.data = transfer
    this.setIsWaitingForEvent(false)
    this.setBlockTransfer(transfer?.block?.number)
  }

  // We listen to only events related to transfer change, not transfer initialization
  // This store is supposed to be used only on existing transfers (TransferStatus.Drafted or TransferStatus.Created)

  onTransferInit(tokenId: BigNumber, from: string, to: string, blockNumber: number) {
    console.log('onTransferInit')
    if (this.checkExistStatus(TransferStatus.Created)) return
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
      this.setBlockTransfer(blockNumber)
    })
  }

  onTransferDraft(tokenId: BigNumber, from: string, blockNumber: number) {
    console.log('onTransferDraft')
    if (this.checkExistStatus(TransferStatus.Drafted)) return
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
      this.setBlockTransfer(blockNumber)
      this.onTransferDraftCall?.()
    })
  }

  onTransferDraftCompletion(tokenId: BigNumber, to: string, blockNumber: number) {
    console.log('onTransferCompletion')
    this.checkData(tokenId, data => {
      data.to = to
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(blockNumber)
    })
  }

  onTransferPublicKeySet(tokenId: BigNumber, publicKeyHex: string, blockNumber: number) {
    console.log('onTransferPublicKeySet')
    if (this.checkExistStatus(TransferStatus.PublicKeySet)) return
    this.checkData(tokenId, data => {
      data.publicKey = publicKeyHex
      data.statuses?.unshift({
        status: TransferStatus.PublicKeySet,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(blockNumber)
      this.onTransferPublicKeySetCall?.()
    })
  }

  onTransferPasswordSet(tokenId: BigNumber, encryptedPasswordHex: string, blockNumber: number) {
    console.log('onTransferPasswordSet')
    if (this.checkExistStatus(TransferStatus.PasswordSet)) return
    this.checkData(tokenId, data => {
      data.encryptedPassword = encryptedPasswordHex
      data.statuses?.unshift({
        status: TransferStatus.PasswordSet,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(blockNumber)
    })
  }

  onTransferFinished(tokenId: BigNumber) {
    console.log('onTransferFinished')
    if (!this.data) return
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.setIsWaitingForEvent(false)
      this.tokenStore.reload()
      this.onTransferFinishedCall?.()
    })
  }

  onTransferFraudReported(tokenId: BigNumber, blockNumber: number) {
    console.log('onTransferFraud')
    if (this.checkExistStatus(TransferStatus.FraudReported)) return
    this.checkData(tokenId, data => {
      data.statuses?.unshift({
        status: TransferStatus.FraudReported,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(blockNumber)
    })
  }

  onTransferFraudDecided(tokenId: BigNumber, approved: boolean, blockNumber: number) {
    if (this.checkExistStatus(TransferStatus.Finished)) return
    this.checkData(tokenId, data => {
      data.fraudApproved = approved
      data.statuses?.unshift({
        status: TransferStatus.Finished,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.setBlockTransfer(blockNumber)
    })
  }

  onTransferCancellation(tokenId: BigNumber, blockNumber: number) {
    console.log('onTransferCancel')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.setIsWaitingForEvent(false)
      this.onTransferCancelCall?.()
    })
  }

  get isWaitingForContinue() {
    return this.isWaitingForEvent || this.isWaitingForReciept
  }
}
