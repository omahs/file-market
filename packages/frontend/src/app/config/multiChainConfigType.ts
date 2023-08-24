import { Chain } from '@web3modal/ethereum'

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
