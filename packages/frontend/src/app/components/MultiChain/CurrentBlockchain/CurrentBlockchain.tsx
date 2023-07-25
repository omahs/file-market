import { ComponentProps } from '@stitches/react'
import React from 'react'

import { styled } from '../../../../styles'
import { Txt } from '../../../UIkit'
import CurrentBlockchainBlock from './CurrentBlockchainBlock/CurrentBlockchainBlock'

const CurrentBlockchainStyle = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  background: 'none',
  height: '56px',
  variants: {
    isLight: {
      true: {
        color: 'white',
      },
    },
  },
})

const LinearText = styled(Txt, {
  background: 'linear-gradient(135deg, #028FFF 0%, #04E762 100%)',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
})

type ICurrentBlockchain = ComponentProps<typeof CurrentBlockchainStyle> & {
  isVisible?: boolean
}
const CurrentBlockchain = ({ isVisible, isLight }: ICurrentBlockchain) => {
  return (
    <>
      {isVisible && (
        <CurrentBlockchainStyle isLight={isLight}>
          <Txt>Current blockchain:</Txt>
          <CurrentBlockchainBlock isLight={isLight} isActive />
          <CurrentBlockchainBlock isLight={isLight} />
          <CurrentBlockchainBlock isLight={isLight} />
          <LinearText>
            Ethereum will be available coming soon!
          </LinearText>
        </CurrentBlockchainStyle>
      )}
    </>
  )
}

export default CurrentBlockchain
