import multichainConfig from '../../config/multiChainConfig.json'
import { IMultiChainConfig } from '../../config/multiChainConfigType'

export const getChainFromConfigById = (chainId: number | undefined): IMultiChainConfig | undefined => {
  if (chainId === undefined) return

  return (JSON.parse(JSON.stringify(multichainConfig)) as IMultiChainConfig[]).find(item => item.chain.id === chainId)
}
