import { type FileMarketCrypto } from '../../../../../crypto/src'
import { type IBlockchainDataProvider } from '../BlockchainDataProvider'
import { type ISeedProvider } from '../SeedProvider'

export interface IHiddenFileBase {
  readonly collectionAddress: ArrayBuffer
  readonly tokenId: number
  readonly crypto: FileMarketCrypto
  readonly seedProvider: ISeedProvider
  readonly blockchainDataProvider: IBlockchainDataProvider
}
