import { parseUnits } from 'ethers/lib.esm/utils'

export const fee = +import.meta.env.VITE_MARKETPLACE_FEE
const isMainnet = import.meta.env.VITE_IS_MAINNET

export const mark3dConfig = {
  externalLink: 'https://filemarket.xyz/',
  transferTimeout: 24 * 60 * 60 * 1000,
  fileBunniesPrice: isMainnet ? parseUnits('12.0', 'ether') : parseUnits('0.01', 'ether'),
} as const
