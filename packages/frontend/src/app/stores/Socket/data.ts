import { ConnectionType } from './types'

export const makeWsUrl = (relativeUrl: string): string => {
  return window.location.protocol.replace(/http/, 'ws') + '//' + window.location.host + relativeUrl
}

export const url: Record<ConnectionType, string> = {
  [ConnectionType.Eft]: '/ws/subscribe/eft',
}
