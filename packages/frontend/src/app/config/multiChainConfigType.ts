import { Chain } from "wagmi"

export interface IMultiChainConfig {
  chain: Chain
  img: string
  imgGray: string
  accessTokenAddress: string
  exchangeTokenAddress: string
  isDefault?: boolean
  baseUrl: string
  explorer: string
  wsUrl: string
}
