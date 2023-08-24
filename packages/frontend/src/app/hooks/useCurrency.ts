import { Chain } from '@web3modal/ethereum'
import { BigNumber, BigNumberish, utils } from 'ethers'
import { formatUnits } from 'ethers/lib.esm/utils'
import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'

import { formatNumber } from '../utils/number'
import { Params } from '../utils/router'
import { formatCurrency as formatCurrencyProps } from '../utils/web3'
import { useConfig } from './useConfig'
import { useMultiChainStore } from './useMultiChainStore'

export const useCurrency = () => {
  const configHook = useConfig()
  const { chainName } = useParams<Params>()
  const multiChainStore = useMultiChainStore()

  const chain: Chain = useMemo(() => {
    return multiChainStore.getChainByName(chainName)?.chain ?? configHook.chain
  }, [configHook, chainName])

  const formatCurrency = useCallback((value: BigNumberish) => {
    return formatCurrencyProps(value, chain)
  }, [chain])

  const toCurrency = useCallback((value: BigNumber): number => {
    const decimals = chain.nativeCurrency?.decimals ?? 18

    return Number(utils.formatUnits(value, decimals))
  }, [chain])

  const fromCurrency = useCallback((value: number): BigNumber => {
    const decimals = chain.nativeCurrency?.decimals ?? 18
    const meaningfulDecimals = 9

    return BigNumber
      .from(Math.round(value * Math.pow(10, meaningfulDecimals)))
      .mul(BigNumber.from(Math.pow(10, decimals - meaningfulDecimals)))
  }, [chain])

  const formatUsd = useCallback((value: string | number) => {
    return `${formatNumber(value, 2)}$`
  }, [chain])

  const formatRoyalty = useCallback((value: BigNumberish) => {
    return +formatUnits(value, 2)
  }, [chain])

  const formatFee = useCallback((value: BigNumberish) => {
    return +formatUnits(value, 2)
  }, [chain])

  return {
    formatCurrency,
    fromCurrency,
    toCurrency,
    formatUsd,
    formatFee,
    formatRoyalty,
  }
}
