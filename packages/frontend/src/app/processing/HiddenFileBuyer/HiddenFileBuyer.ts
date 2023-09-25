import { type FileMarketCrypto } from '../../../../../crypto/src'
import { type IBlockchainDataProvider } from '../BlockchainDataProvider'
import { type ISeedProvider } from '../SeedProvider'
import { type PersistentDerivationArgs } from '../types'
import { assertSeed } from '../utils'
import { type IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  #tokenFullIdArgs: [ArrayBuffer, number]
  #persistentArgs: PersistentDerivationArgs
  #isFirefox: boolean

  constructor(
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider,
    public readonly seedProvider: ISeedProvider,
    public readonly globalSalt: ArrayBuffer,
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number,
  ) {
    this.#tokenFullIdArgs = [this.collectionAddress, this.tokenId]
    this.#persistentArgs = [this.globalSalt, ...this.#tokenFullIdArgs]
    this.#isFirefox = navigator.userAgent.includes('Firefox')
  }

  async initBuy(): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const dealNumber = await this.blockchainDataProvider.getTransferCount(...this.#tokenFullIdArgs)
    const { pub } = await this.crypto.eftRsaDerivation(
      this.seedProvider.seed,
      ...this.#persistentArgs,
      dealNumber,
      { disableWorker: this.#isFirefox },
    )

    return pub
  }

  async revealRsaPrivateKey(): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const dealNumber = await this.blockchainDataProvider.getTransferCount(...this.#tokenFullIdArgs)
    const { priv } = await this.crypto.eftRsaDerivation(
      this.seedProvider.seed,
      ...this.#persistentArgs,
      dealNumber,
      { disableWorker: this.#isFirefox },
    )

    return priv
  }
}
