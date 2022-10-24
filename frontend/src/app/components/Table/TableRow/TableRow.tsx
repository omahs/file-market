import React, { FC, ReactNode } from 'react'
import { styled } from '../../../../styles'
import cross from './img/cross.svg'
import check from './img/check.svg'
import arrow from './img/arrow.svg'

const ItemWrapper = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: '80px',
  color: '$gray500',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between'
})

const ItemBody = styled('div', {
  display: 'flex',
  padding: '$3 $4',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: '1 1 auto',
  gap: '$3'
})

const ItemArrow = styled('div', {
  alignItems: 'center',
  padding: '$4',
  '@md': {
    paddingLeft: 0
  },
  flexShrink: 0
})

export const RowProperty = styled('div', {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  variants: {
    title: {
      true: {
        color: '$blue500',
        fontWeight: 600
      }
    },
    hide: {
      sm: {
        '@sm': {
          display: 'none'
        }
      },
      md: {
        '@md': {
          display: 'none'
        }
      },
      lg: {
        '@lg': {
          display: 'none'
        }
      },
      xl: {
        '@xl': {
          display: 'none'
        }
      }
    }
  }
})

const Icon = styled('img', {
  width: '20px',
  height: '20px'
})

export const CheckIcon = () => <Icon src={check} alt='Check icon' />

export const CrossIcon = () => <Icon src={cross} alt='Cross icon' />

interface Props {
  title?: string
  children: ReactNode | JSX.Element | JSX.Element[]
}

export const TableRow: FC<Props> = ({ children }) => {
  return (
    <ItemWrapper>
      <ItemBody>{children}</ItemBody>
      <ItemArrow>
        <img src={arrow} alt='' />
      </ItemArrow>
    </ItemWrapper>
  )
}
