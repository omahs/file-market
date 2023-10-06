/**
 * Is responsible for creating StorageProvider, SecureStorageProvider, TokenIdStorage
 * for every account
 */
import { type ISecureStorage } from '../SecureStorage'
import { type IStorageProvider } from '../StorageProvider'

export interface AllStorages {
  storageProvider: IStorageProvider
  secureStorage: ISecureStorage
}

export interface IStorageFactory {
  getStorages: (account: string) => Promise<AllStorages>
}
