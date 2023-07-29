/* eslint-disable react/jsx-one-expression-per-line */
import { BigNumber } from 'ethers'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { fee } from '../../../../config/mark3d'
import { useSaleAmountWillReceived } from '../../../../hooks'
import { useCurrency } from '../../../../hooks/useCurrency'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Label } from '../../../../pages/CreatePage/helper/style/style'
import { TokenFullId } from '../../../../processing/types'
import { ButtonGlowing, Flex, FormControl, Input, PriceBadge } from '../../../../UIkit'
import { formatNumber } from '../../../../utils/number'
import { StyledFlex, StyledPriceDescription } from './OrderForm.styles'

export interface OrderFormValue {
  price: BigNumber
}

interface OrderFormRawValue {
  price: number | string
}

export interface OrderFormProps {
  defaultValues?: OrderFormValue
  onSubmit?: (value: OrderFormValue) => void
  tokenFullId: TokenFullId
}

export const OrderForm: FC<OrderFormProps> = observer(({
  defaultValues,
  onSubmit,
  tokenFullId,
}) => {
  const { formatRoyalty, toCurrency, fromCurrency } = useCurrency()
  const tokenStore = useTokenStore(tokenFullId.collectionAddress, tokenFullId.tokenId)

  const importFormValue = useCallback((value?: OrderFormValue): OrderFormRawValue => ({
    price: value ? toCurrency(value.price) : '',
  }), [toCurrency])

  const exportFormValue = useCallback((rawValue: OrderFormRawValue): OrderFormValue => ({
    price: fromCurrency(+rawValue.price ?? 0),
  }), [fromCurrency])

  const { handleSubmit, control, watch } = useForm<OrderFormRawValue>({
    defaultValues: importFormValue(defaultValues),
  })
  const price = watch('price')
  const {
    amountWillReceived,
    amountWillReceivedUsd,
    isLoading,
  } = useSaleAmountWillReceived(tokenFullId, +price)

  return (
    <form onSubmit={handleSubmit(values => {
      onSubmit?.(exportFormValue(values))
    })}
    >
      <FormControl>
        <Label css={{ textAlign: 'left' }}>Price</Label>
        <Flex w100 flexDirection='column' gap="$3">
          <Input<OrderFormRawValue>
            type="number"
            step="any"
            placeholder='Enter value'
            after="FIL"
            controlledInputProps={{
              control,
              name: 'price',
              rules: { required: true },
            }}
          />
          {(!!fee || !!tokenStore.data?.royalty) && (
            <StyledFlex flexDirection='column' gap={12}>
              <StyledPriceDescription>
                After reducing the total by
                {' '}
                {!!fee && (
                  <>
                    the marketplace commission
                    (<span>{fee}%</span>)
                  </>
                )}
                {!!fee && !!tokenStore.data?.royalty && ' and '}
                {!!tokenStore.data?.royalty && (
                  <>
                    the author&apos;s royalty (<span>{formatRoyalty(tokenStore.data.royalty)}%</span>)
                  </>
                )}
                {' '}
                after the sale of an EFT, <span>you will receive:</span>
              </StyledPriceDescription>
              <PriceBadge
                size="md"
                background='secondary'
                right={`~${formatNumber(amountWillReceivedUsd, 2) || 0}$`}
                left={formatNumber(amountWillReceived, 3) || 0}
                isLoading={isLoading}
              />
            </StyledFlex>
          )}
        </Flex>
      </FormControl>
      <Flex w100 justifyContent='end'>
        <ButtonGlowing
          fullWidth
          type="submit"
        >
          Place order
        </ButtonGlowing>
      </Flex>
    </form>
  )
})
