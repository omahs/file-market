import { BigNumberish, utils } from 'ethers'
import { Chain } from 'wagmi'

export const formatCurrency = (value: BigNumberish, chain: Chain | undefined) => {
  const decimals = chain?.nativeCurrency?.decimals ?? 18
  const symbol = chain?.nativeCurrency?.symbol ?? 'BNB'
  const computedValue = utils.formatUnits(value, decimals)

  return `${parseFloat(computedValue) > 0.0000001 ? computedValue : '~0'} ${symbol}`
}
