import { utils } from 'ethers'
import { parseUnits } from 'ethers/lib.esm/utils'

import fileBunniesCollection from '../../abi/FileBunniesCollection'
import collectionToken from '../../abi/FilemarketCollectionV2'
import exchangeToken from '../../abi/FilemarketExchangeV2'
import accessToken from '../../abi/Mark3dAccessTokenV2'
import { getChainFromConfigById } from '../utils/chain/getChainConfig'
import { IMultiChainConfig } from './multiChainConfigType'

export const fee = +import.meta.env.VITE_MARKETPLACE_FEE
const isMainnet = import.meta.env.VITE_IS_MAINNET
const defaultChain = isMainnet ? 314 : 314159
export const mark3dConfig = {
  externalLink: 'https://filemarket.xyz/',
  transferTimeout: 24 * 60 * 60 * 1000,
  fileBunniesPrice: isMainnet ? parseUnits('12.0', 'ether') : parseUnits('0.01', 'ether'),
} as const

export const getConfigById = (chainId: number | undefined) => {
  let chain = getChainFromConfigById(chainId)
  if (!chain) chain = getChainFromConfigById(defaultChain) as IMultiChainConfig

  return {
    chain: chain.chain,
    // Hardcode high gas price in testnet to prevent "transaction underpriced" error
    gasPrice: !isMainnet ? utils.parseUnits('30', 'gwei') : undefined,
    accessToken: {
      address: chain.accessTokenAddress,
      abi: accessToken.abi,
      name: accessToken.contractName,
    },
    exchangeToken: {
      address: chain.exchangeTokenAddress,
      abi: exchangeToken.abi,
      name: exchangeToken.contractName,
    },
    collectionToken: {
      // address is created when a new collection is minted
      abi: collectionToken.abi,
      name: collectionToken.contractName,
    },
    fileBunniesCollectionToken: {
      abi: fileBunniesCollection.abi,
      name: fileBunniesCollection.contractName,
      address: '0xBc3a4453Dd52D3820EaB1498c4673C694c5c6F09',
    },
  }
}
