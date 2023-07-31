import { BigNumber, BigNumberish, utils } from 'ethers'
import { formatUnits } from 'ethers/lib.esm/utils'
import { useCallback } from 'react'

import { formatNumber } from '../utils/number'
import { formatCurrency as formatCurrencyProps } from '../utils/web3'
import { useConfig } from './useConfig'

export const useCurrency = () => {
  const config = useConfig()

  const formatCurrency = useCallback((value: BigNumberish) => {
    return formatCurrencyProps(value, config?.chain)
  }, [config])

  const toCurrency = useCallback((value: BigNumber): number => {
    const decimals = config?.chain.nativeCurrency?.decimals ?? 18

    return Number(utils.formatUnits(value, decimals))
  }, [config])

  const fromCurrency = useCallback((value: number): BigNumber => {
    const decimals = config?.chain.nativeCurrency?.decimals ?? 18
    const meaningfulDecimals = 9

    return BigNumber
      .from(Math.round(value * Math.pow(10, meaningfulDecimals)))
      .mul(BigNumber.from(Math.pow(10, decimals - meaningfulDecimals)))
  }, [config])

  const formatUsd = useCallback((value: string | number) => {
    return `${formatNumber(value, 2)}$`
  }, [config])

  const formatRoyalty = useCallback((value: BigNumberish) => {
    return +formatUnits(value, 2)
  }, [config])

  const formatFee = useCallback((value: BigNumberish) => {
    return +formatUnits(value, 2)
  }, [config])

  return {
    formatCurrency,
    fromCurrency,
    toCurrency,
    formatUsd,
    formatFee,
    formatRoyalty,
  }
}
