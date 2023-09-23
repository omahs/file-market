import { Chain } from 'wagmi'

export interface IMultiChainConfig {
  chain: Chain
  img: string
  imgGray: string
  accessTokenAddress: `0x${string}`
  exchangeTokenAddress: `0x${string}`
  isDefault?: boolean
  baseUrl: string
  explorer: string
  wsUrl: string
}
