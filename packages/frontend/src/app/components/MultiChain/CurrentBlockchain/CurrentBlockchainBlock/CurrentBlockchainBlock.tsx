import { ComponentProps } from '@stitches/react'
import React from 'react'

import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'
import BlockImg from '../../helper/assets/img/BCHBlockIcon.png'

const CurrentBlockchainBlockStyle = styled('div', {
  display: 'flex',
  width: '108px',
  height: '32px',
  borderRadius: '16px',
  outline: '2px solid #CFD1D4',
  color: '#4E5156',
  padding: '1px 12px 1px 1px',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  ...textVariant('primary2').true,
  '& img': {
    width: '30px',
    height: '30px',
  },
  variants: {
    isLight: {
      true: {
        color: 'white',
      },
    },
    isActive: {
      true: {
        color: '#0090FF',
        outlineColor: '#0090FF',
      },
    },
  },
  '&:hover': {
    color: '#0090FF',
  },
})

export type ICurrentBlockchainBlock = ComponentProps<typeof CurrentBlockchainBlockStyle>

const CurrentBlockchainBlock = (props: ICurrentBlockchainBlock) => {
  return (
    <CurrentBlockchainBlockStyle {...props}>
      <img src={BlockImg} />
      FileCoin
    </CurrentBlockchainBlockStyle>
  )
}

export default CurrentBlockchainBlock
