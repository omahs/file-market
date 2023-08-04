export interface ObjectParamsConnectEft {
  id?: string
  address?: `0x${string}`
}

export enum ConnectionType {
  Eft,
}

export interface ISocketConnect {
  socket?: WebSocket
  type?: ConnectionType
  isConnected?: boolean
}
