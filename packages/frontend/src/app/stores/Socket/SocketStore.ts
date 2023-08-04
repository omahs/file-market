import { makeAutoObservable } from 'mobx'

import { EFTSubscriptionMessage } from '../../../swagger/Api'
import { MultiChainStore } from '../MultiChain/MultiChainStore'
import { OrderStore } from '../Order/OrderStore'
import { RootStore } from '../RootStore'
import { TransferStore } from '../Transfer/TransferStore'
import { url } from './data'
import { ConnectionType, ISocketConnect, ObjectParamsConnectEft } from './types'

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
  onSubscribeMessage: (event: MessageEvent<M>) => void
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

  private readonly createISocketConnect = ({ socket, type }: { socket: WebSocket, type: ConnectionType }): ISocketConnect => {
    return ({
      socket,
      type,
      isConnected: true,
    })
  }

  private readonly subscribe = <T, M>({ params, type, url, onSubscribeMessage }: ISubscribe<T, M>) => {
    const socket = this.createConnection(url)
    socket.onopen = function(this) {
      this.send(JSON.stringify(params))
    }
    socket.onmessage = onSubscribeMessage
    this.disconnect(type)
    console.log(this.findIndexSocket(type))
    if (this.socketConnects[this.findIndexSocket(type)]) {
      this.socketConnects[this.findIndexSocket(type)] = this.createISocketConnect({ socket, type })
    } else {
      this.socketConnects = [...this.socketConnects, (this.createISocketConnect({ socket, type }))]
    }
  }

  private readonly findIndexSocket = (type: ConnectionType) => {
    return this.socketConnects.findIndex(item => item.type === type)
  }

  private readonly onMessageSubscribeToEft = (event: MessageEvent<EFTSubscriptionMessage>) => {
    const transfer = event.data.transfer
    const order = event.data.order
    const socketConnect = this.socketConnects[this.findIndexSocket(ConnectionType.Eft)]
    if (transfer && socketConnect?.isConnected) {
      this.transferStore.setData(transfer)
    }
    if (order && socketConnect?.isConnected) {
      this.orderStore.setData(order)
    }
  }

  disconnect(type: ConnectionType) {
    const socketConnect = this.socketConnects[this.findIndexSocket(type)]
    console.log('Disconnect')
    if (socketConnect?.socket) {
      socketConnect.socket.onclose = () => {}
      socketConnect.socket?.close()
      socketConnect.isConnected = false
    }
  }

  subscribeToEft(params: ObjectParamsConnectEft, chainName?: string) {
    if (this.isConnectedEft) return
    const wsUrl = this.multiChainStore.getChainByName(chainName)?.wsUrl
    this.subscribe<ObjectParamsConnectEft, EFTSubscriptionMessage>({
      params,
      url: `${wsUrl}${url[ConnectionType.Eft]}/${params.address}/${params.id}`,
      type: ConnectionType.Eft,
      onSubscribeMessage: this.onMessageSubscribeToEft,
    })
  }

  createConnection(url: string) {
    const socket = new WebSocket(url)

    return socket
  }

  unsubscribeEft() {
    this.disconnect(ConnectionType.Eft)
  }

  get isConnectedEft() {
    const socketConnect = this.socketConnects[this.findIndexSocket(ConnectionType.Eft)]

    return socketConnect?.socket?.readyState === WebSocket.OPEN
  }
}
