import { Chain } from '@web3modal/ethereum'
import { BigNumberish, utils } from 'ethers'

export const formatCurrency = (value: BigNumberish, chain: Chain | undefined) => {
  const decimals = chain?.nativeCurrency?.decimals ?? 18
  const symbol = chain?.nativeCurrency?.symbol ?? 'BNB'
  const computedValue = utils.formatUnits(value, decimals)

  return `${parseFloat(computedValue) > 0.0000001 ? computedValue : '~0'} ${symbol}`
}
