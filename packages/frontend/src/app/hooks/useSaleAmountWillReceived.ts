import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { formatEther } from 'viem'

import { fee } from '../config/mark3d'
import { hexToBuffer } from '../processing'
import { useBlockchainDataProvider } from '../processing/BlockchainDataProvider'
import { type TokenFullId } from '../processing/types'
import { useConversionRateStore } from './useConversionRateStore'

export const useSaleAmountWillReceived = ({ collectionAddress, tokenId }: TokenFullId, price: number, isCreator?: boolean) => {
  const [amountWillReceived, setAmountWillReceived] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const conversionRateStore = useConversionRateStore()
  const blockchainDataProvider = useBlockchainDataProvider()
  const debouncedPrice = useDebounce(price, 400)

  const amountWillReceivedUsd = useMemo(() => {
    if (!amountWillReceived || !conversionRateStore.data?.rate) return 0

    return +amountWillReceived * conversionRateStore.data.rate
  }, [amountWillReceived, conversionRateStore.data])

  const getSaleAmountWithoutFee = async () => {
    if (!fee) return price

    return price - (price * fee / 100)
  }

  const getRoyaltyAmount = async (salePriceWithFee: number) => {
    const royaltyAmountBN = await blockchainDataProvider.getRoyaltyAmount(
      hexToBuffer(collectionAddress),
      +tokenId,
      BigInt(salePriceWithFee),
    )

    return +formatEther(royaltyAmountBN)
  }

  const calcSaleAmountWillReceived = async () => {
    setIsLoading(true)

    const saleAmountWithFee = await getSaleAmountWithoutFee()
    const royaltyAmount = await getRoyaltyAmount(saleAmountWithFee)

    setAmountWillReceived(isCreator ? saleAmountWithFee : saleAmountWithFee - royaltyAmount)
    setIsLoading(false)
  }

  useEffect(() => {
    calcSaleAmountWillReceived()
  }, [debouncedPrice, isCreator])

  return useMemo(() => ({
    amountWillReceived,
    isLoading,
    amountWillReceivedUsd,
  }),
  [amountWillReceived, isLoading, amountWillReceivedUsd])
}
