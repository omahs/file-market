import React, { useMemo } from 'react'

import { ButtonProps, useButton } from '../../../Button'
import { StyledButton } from './WhitelistCardButton.styles'

export interface WhitelistCardButtonProps extends ButtonProps {
  variant: 'free' | 'mint' | 'check' | 'notWl' | 'soldOut' | 'mintedOut' | 'incorrectNetwork'

}

export const WhitelistCardButton = React.forwardRef<HTMLButtonElement, WhitelistCardButtonProps>((
  {
    variant,
    ...props
  },
  ref,
) => {
  const { buttonRef, buttonProps } = useButton(props, ref)

  const text = useMemo(() => {
    if (variant === 'free' || variant === 'notWl') return 'FREE MINT'
    if (variant === 'check') return 'CHECK WL'
    if (variant === 'mintedOut') return 'MINTED OUT'
    if (variant === 'soldOut') return 'SOLD OUT'
    if (variant === 'incorrectNetwork') return 'CHANGE NETWORK'

    return variant.toUpperCase()
  }, [variant, props.isDisabled])

  return (
    <StyledButton ref={buttonRef} {...buttonProps} variant={variant}>
      {text}
    </StyledButton>
  )
})
