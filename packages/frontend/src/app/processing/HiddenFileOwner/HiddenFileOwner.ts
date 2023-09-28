import { getAddress } from 'viem'

import { type FileMarketCrypto } from '../../../../../crypto/src'
import { type RsaPublicKey } from '../../../../../crypto/src/lib/types'
import { type IBlockchainDataProvider } from '../BlockchainDataProvider'
import { type ISeedProvider } from '../SeedProvider'
import { type DecryptResult, type FileMeta, type PersistentDerivationArgs } from '../types'
import { assertSeed, hexToBuffer } from '../utils'
import { type IHiddenFileOwner } from './IHiddenFileOwner'

export class HiddenFileOwner implements IHiddenFileOwner {
  #persistentArgs: PersistentDerivationArgs
  #tokenFullIdArgs: [ArrayBuffer, number]
  #isFirefox: boolean

  constructor(
    public readonly address: string,
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider,
    public readonly seedProvider: ISeedProvider,
    public readonly globalSalt: ArrayBuffer,
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number,
    public readonly filesCache: WeakMap<[ArrayBuffer, number], File>,
  ) {
    this.#tokenFullIdArgs = [this.collectionAddress, this.tokenId]
    this.#persistentArgs = [this.globalSalt, ...this.#tokenFullIdArgs]
    this.#isFirefox = navigator.userAgent.includes('Firefox')
  }

  async #getFilePassword(): Promise<ArrayBuffer> {
    console.log('Start assert')
    assertSeed(this.seedProvider.seed)

    console.log('Creator')

    const creator = await this.blockchainDataProvider.getTokenCreator(...this.#tokenFullIdArgs)

    console.log('If')

    if (this.address === getAddress(creator)) {
      const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...this.#persistentArgs)

      console.log('If success')

      return aesKeyAndIv.key
    }

    console.log('If not success')

    const {
      encryptedPassword,
      dealNumber,
    } = await this.blockchainDataProvider.getLastTransferInfo(...this.#tokenFullIdArgs)

    console.log('Eft Rsa Der')

    const { priv } = await this.crypto.eftRsaDerivation(
      this.seedProvider.seed,
      ...this.#persistentArgs,
      dealNumber,
      { disableWorker: this.#isFirefox },
    )

    console.log('Return rsa')

    return this.crypto.rsaDecrypt(hexToBuffer(encryptedPassword), priv)
  }

  async decryptFile(encryptedFile: ArrayBuffer, meta: FileMeta | undefined): Promise<DecryptResult<File>> {
    let result = this.filesCache.get(this.#tokenFullIdArgs)
    if (result) return { ok: true, result }

    try {
      console.log('Password')
      const password = await this.#getFilePassword()
      console.log('DecryptFile2')
      const decryptedFile = await this.crypto.aesDecrypt(encryptedFile, password)
      console.log('File')
      result = new File([decryptedFile], meta?.name || 'hidden_file', { type: meta?.type })
      console.log('Fileset')
      this.filesCache.set(this.#tokenFullIdArgs, result)

      return { ok: true, result }
    } catch (error) {
      return {
        ok: false,
        error: `Decrypt failed: ${error}`,
      }
    }
  }

  async encryptFile(file: File): Promise<Blob> {
    assertSeed(this.seedProvider.seed)

    const arrayBuffer = await file.arrayBuffer()
    const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...this.#persistentArgs)
    const encrypted = await this.crypto.aesEncrypt(arrayBuffer, aesKeyAndIv)

    return new Blob([encrypted])
  }

  async encryptFilePassword(publicKey: RsaPublicKey): Promise<ArrayBuffer> {
    const password = await this.#getFilePassword()
    const encryptedPassword = await this.crypto.rsaEncrypt(password, publicKey)

    return encryptedPassword
  }
}
