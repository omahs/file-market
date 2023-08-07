import { makeAutoObservable } from 'mobx'

import { EFTSubscriptionMessage, EFTSubscriptionRequest } from '../../../swagger/Api'
import { MultiChainStore } from '../MultiChain/MultiChainStore'
import { OrderStore } from '../Order/OrderStore'
import { RootStore } from '../RootStore'
import { TransferStore } from '../Transfer/TransferStore'
import { url } from './data'
import { ConnectionType, ISocketConnect } from './types'

interface sendQueueType {
  message: string
  onMessage: (event: MessageEvent) => void
  onConnect?: () => void
  type: ConnectionType
}

interface ISubscribe<T, M> {
  params: T
  url: string
  type: ConnectionType
  onSubscribeMessage: (event: MessageEvent<M>, chainName?: string) => void
  chainName?: string
}

interface IFindSocket {
  chainName?: string
  type: ConnectionType
}

export class SocketStore {
  socketConnects: ISocketConnect[]
  sendQueue: sendQueueType[]
  multiChainStore: MultiChainStore

  transferStore: TransferStore
  orderStore: OrderStore

  constructor(rootStore: RootStore) {
    this.sendQueue = []
    this.socketConnects = []
    makeAutoObservable(this)
    this.transferStore = rootStore.transferStore
    this.orderStore = rootStore.orderStore
    this.multiChainStore = rootStore.multiChainStore
  }

  private readonly createISocketConnect = ({ socket, type, chainName }: { socket: WebSocket, type: ConnectionType, chainName?: string }): ISocketConnect => {
    return ({
      socket,
      type,
      chainName,
      isConnected: true,
    })
  }

  private readonly subscribe = <T, M>({ params, type, url, onSubscribeMessage, chainName }: ISubscribe<T, M>) => {
    let socket: WebSocket
    const socketConnect = this.socketConnects[this.findIndexSocket({ type, chainName })]
    if (!socketConnect) {
      socket = this.createConnection(url)
      socket.onopen = function(this) {
        this.send(JSON.stringify(params))
      }
      socket.onmessage = function(event: MessageEvent<M>) {
        onSubscribeMessage(event, chainName)
      }
      this.socketConnects = [...this.socketConnects, (this.createISocketConnect({ socket, type, chainName }))]
    } else {
      socketConnect.socket?.send(JSON.stringify(params))
      this.socketConnects[this.findIndexSocket({ type })].isConnected = true
    }
  }

  private readonly findIndexSocket = ({ type, chainName }: IFindSocket) => {
    return this.socketConnects.findIndex(item => {
      if (chainName) {
        return item.type === type && item.chainName === chainName
      }

      return item.type === type
    })
  }

  private readonly onMessageSubscribeToEft = (event: MessageEvent<EFTSubscriptionMessage>, chainName?: string) => {
    const transfer = event.data.transfer
    const order = event.data.order
    const socketConnect = this.socketConnects[this.findIndexSocket({ type: ConnectionType.Eft, chainName })]
    if (transfer && socketConnect?.isConnected) {
      this.transferStore.setData(transfer)
    }
    if (order && socketConnect?.isConnected) {
      this.orderStore.setData(order)
    }
  }

  disconnect({ type, chainName }: IFindSocket) {
    const socketConnect = this.socketConnects[this.findIndexSocket({ type, chainName })]
    console.log('Disconnect')
    if (socketConnect?.socket) {
      socketConnect.socket.onclose = () => {}
      socketConnect.socket?.close()
      this.socketConnects.splice(this.findIndexSocket({ type, chainName }), 1)
    }
  }

  subscribeToEft(params: EFTSubscriptionRequest, chainName?: string) {
    const wsUrl = this.multiChainStore.getChainByName(chainName)?.wsUrl
    this.socketConnects.forEach(item => {
      if (item.chainName !== chainName && item.type === ConnectionType.Eft) this.disconnect({ type: item.type, chainName: item.chainName })
    })
    this.subscribe<EFTSubscriptionRequest, EFTSubscriptionMessage>({
      params,
      url: `${wsUrl}${url[ConnectionType.Eft]}/${params.collectionAddress}/${params.tokenId}`,
      type: ConnectionType.Eft,
      onSubscribeMessage: this.onMessageSubscribeToEft,
      chainName,
    })
  }

  createConnection(url: string) {
    const socket = new WebSocket(url)

    return socket
  }

  // unsubscribeEft() {
  //   this.disconnect(ConnectionType.Eft)
  // }
  //
  // get isConnectedEft() {
  //   const socketConnect = this.socketConnects[this.findIndexSocket({ type: ConnectionType.Eft })]
  //
  //   return socketConnect?.socket?.readyState === WebSocket.OPEN
  // }
}
