import { Chain } from '@web3modal/ethereum'

export interface IMultiChainConfig {
  chain: Chain
  img: string
  accessTokenAddress: string
  exchangeTokenAddress: string
  isDefault?: boolean
  baseUrl: string
}
