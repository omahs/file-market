import { AuthStore } from './auth/AuthStore'
import { BlockStore } from './BlockStore/BlockStore'
import { CollectionStore } from './Collection/CollectionStore'
import { CollectionAndTokenListStore } from './CollectionAndTokenList/CollectionAndTokenListStore'
import { CollectionListStore } from './CollectionsList/CollectionListStore'
import { CollectionTokenListStore } from './CollectionTokenList/CollectionTokenListStore'
import { ConversionRateStore } from './Currency/ConversionRateStore'
import { DialogStore } from './Dialog/DialogStore'
import { ErrorStore } from './Error/ErrorStore'
import { OrderStore } from './Order/OrderStore'
import { OpenOrderListStore } from './OrderList/OrderListStore'
import { PublicCollectionStore } from './PublicCollectionStore/PublicCollectionStore'
import { TokenMetaStore } from './Token/TokenMetaStore'
import { TokenStore } from './Token/TokenStore'
import { TransferListStore } from './Transfer/TransferListStore'
import { TransferStore } from './Transfer/TransferStore'
import { TransfersHistoryStore } from './TransfersHistory/TransfersHistoryStore'
import { UserTransferStore } from './UserTransfers/UserTransfersStore'
import { WhiteListStore } from './WhiteList/WhiteListStore'

export class RootStore {
  authStore: AuthStore
  dialogStore: DialogStore
  blockStore: BlockStore
  errorStore: ErrorStore
  collectionAndTokenList: CollectionAndTokenListStore
  transferListStore: TransferListStore
  transferStore: TransferStore
  collectionTokenList: CollectionTokenListStore
  orderStore: OrderStore
  tokenStore: TokenStore
  tokenMetaStore: TokenMetaStore
  orderListStore: OpenOrderListStore
  collectionStore: CollectionStore
  transfersHistoryStore: TransfersHistoryStore
  userTransferStore: UserTransferStore
  publicCollectionStore: PublicCollectionStore
  conversionRateStore: ConversionRateStore
  whitelistStore: WhiteListStore
  collectionsListStore: CollectionListStore

  constructor() {
    this.dialogStore = new DialogStore()
    this.blockStore = new BlockStore()
    this.errorStore = new ErrorStore(this)
    this.authStore = new AuthStore(this)
    this.collectionAndTokenList = new CollectionAndTokenListStore(this)
    this.transferListStore = new TransferListStore(this)
    this.collectionTokenList = new CollectionTokenListStore(this)
    this.orderStore = new OrderStore(this)
    this.tokenStore = new TokenStore(this)
    this.transferStore = new TransferStore(this)
    this.tokenMetaStore = new TokenMetaStore(this)
    this.orderListStore = new OpenOrderListStore(this)
    this.collectionStore = new CollectionStore(this)
    this.transfersHistoryStore = new TransfersHistoryStore(this)
    this.userTransferStore = new UserTransferStore(this)
    this.publicCollectionStore = new PublicCollectionStore(this)
    this.conversionRateStore = new ConversionRateStore(this)
    this.whitelistStore = new WhiteListStore(this)
    this.collectionsListStore = new CollectionListStore(this)
  }
}

export const rootStore = new RootStore()
