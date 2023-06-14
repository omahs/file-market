import { CollectionStore } from './Collection/CollectionStore'
import { CollectionAndTokenListStore } from './CollectionAndTokenList/CollectionAndTokenListStore'
import { CollectionTokenListStore } from './CollectionTokenList/CollectionTokenListStore'
import { ConversionRateStore } from './Currency/ConversionRateStore'
import { DialogStore } from './Dialog/DialogStore'
import { ErrorStore } from './Error/ErrorStore'
import { FileBunniesTokenStore } from './FileBunnies/FileBunniesTokenStore'
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
  dialogStore: DialogStore
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
  fileBunniesTokenStore: FileBunniesTokenStore

  constructor() {
    this.dialogStore = new DialogStore()
    this.errorStore = new ErrorStore(this)
    this.collectionAndTokenList = new CollectionAndTokenListStore(this)
    this.transferListStore = new TransferListStore(this)
    this.transferStore = new TransferStore(this)
    this.collectionTokenList = new CollectionTokenListStore(this)
    this.orderStore = new OrderStore(this)
    this.tokenStore = new TokenStore(this)
    this.tokenMetaStore = new TokenMetaStore(this)
    this.orderListStore = new OpenOrderListStore(this)
    this.collectionStore = new CollectionStore(this)
    this.transfersHistoryStore = new TransfersHistoryStore(this)
    this.userTransferStore = new UserTransferStore(this)
    this.publicCollectionStore = new PublicCollectionStore(this)
    this.conversionRateStore = new ConversionRateStore(this)
    this.whitelistStore = new WhiteListStore(this)
    this.fileBunniesTokenStore = new FileBunniesTokenStore(this)
  }
}

export const rootStore = new RootStore()
