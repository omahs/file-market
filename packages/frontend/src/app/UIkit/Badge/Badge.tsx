import React, { ComponentProps, FC } from 'react'

import { styled } from '../../../styles'
import { gradientPlaceholderImg } from '../Placeholder'
import { textVariant } from '../Txt'

const Wrapper = styled('div', {
  backgroundColor: '$white',
  display: 'flex',
  gap: '$2',
  padding: '$2 $3',
  alignItems: 'center',
  borderRadius: '$3',
  width: '220px',
  boxShadow: '$form'
})

const Title = styled('p', {
  color: '$gray500',
  ...textVariant('primary3').true
})

const Value = styled('p', {
  ...textVariant('primary1').true,
  color: '$blue500',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: '100%'
})

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$1',
  minHeight: 48,
  width: '140px'
})

const Image = styled('img', {
  width: 48,
  height: 48,
  border: '2px solid $blue500',
  objectFit: 'cover',
  variants: {
    roundVariant: {
      circle: {
        borderRadius: '50%'
      },
      roundedSquare: {
        borderRadius: '$2'
      }
    },
    small: {
      true: {
        width: 40,
        height: 40
      }
    }
  }
})

export interface BadgeProps {
  image?: {
    url: string
    borderRadius: 'circle' | 'roundedSquare'
  }
  content: {
    title?: string
    value: string
  }
  small?: boolean
  wrapperProps?: ComponentProps<typeof Wrapper>
  valueStyles?: ComponentProps<typeof Value>
}

export const Badge: FC<BadgeProps> = (props: BadgeProps) => {
  return (
    <Wrapper {...props.wrapperProps}>
      {props.image && (
        <Image
          src={props.image.url}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = gradientPlaceholderImg
          }}
          roundVariant={props.image.borderRadius}
          small={props.small}
        />
      )}
      <Content>
        {props.content.title && <Title>{props.content.title}</Title>}
        <Value css={props.valueStyles?.css}>{props.content.value}</Value>
      </Content>
    </Wrapper>
  )
}
