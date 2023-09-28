import { formatUnits } from 'viem'
import { type Chain } from 'wagmi'

export const formatCurrency = (value: string, chain: Chain | undefined) => {
  const decimals = chain?.nativeCurrency?.decimals ?? 18
  const symbol = chain?.nativeCurrency?.symbol ?? 'BNB'
  const computedValue = formatUnits(BigInt(value), decimals)

  return `${parseFloat(computedValue) > 0.0000001 ? computedValue : '~0'} ${symbol}`
}
