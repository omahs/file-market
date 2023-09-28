import { makeAutoObservable } from 'mobx'

// rpc sometimes throws error even if currentBlockNumber === receiptBlockNumber
// so this constant adds extra delay
const extraConfirmations = BigInt(1)

export class BlockStore {
  currentBlockNumber: bigint // Dynamic block number from the rpc
  receiptBlockNumber: bigint // Block number from transaction
  // A block number that is equal to the value of currentBlockNumber at the time of the transaction
  lastCurrentBlockNumber: bigint

  constructor() {
    this.receiptBlockNumber = BigInt(0)
    this.currentBlockNumber = BigInt(1)
    this.lastCurrentBlockNumber = BigInt(1)
    makeAutoObservable(this)
  }

  reset(): void {
    this.receiptBlockNumber = BigInt(0)
    this.currentBlockNumber = BigInt(1)
    this.lastCurrentBlockNumber = BigInt(1)
  }

  setCurrentBlock = (currentBlock: bigint) => {
    console.log(currentBlock)
    this.currentBlockNumber = currentBlock
  }

  setReceiptBlock = (recieptBlock: bigint | number) => {
    this.receiptBlockNumber = BigInt(recieptBlock)
    this.lastCurrentBlockNumber = this.currentBlockNumber
  }

  get confirmationsText(): string {
    const progress = (this.currentBlockNumber - this.lastCurrentBlockNumber).toString()
    const remaining = (this.receiptBlockNumber - this.lastCurrentBlockNumber + extraConfirmations).toString()

    return this.canContinue ? ''
      : `Will be available after ${remaining} network confirmations (${progress})`
  }

  get canContinue() {
    return this.lastCurrentBlockNumber === 1n || // to prevent accidental 324233/324234
      this.currentBlockNumber >= (this.receiptBlockNumber + extraConfirmations)
  }
}
