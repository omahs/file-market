import { chainData } from './data'

export const getImg = (chainId: string): string => {
  return chainData[chainId].icon
}
