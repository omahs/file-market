import { styled } from '../../../../styles'
import { Container, Txt } from '../../../UIkit'

export const CurrentBlockchainStyle = styled('div', {
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

export const LinearText = styled(Txt, {
  background: 'linear-gradient(135deg, #028FFF 0%, #04E762 100%)',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
})

export const CurrentBlockchainContainer = styled(Container, {
  borderTop: '2px solid rgba(0,0,0,0.1)',
  variants: {
    isBorderDisabled: {
      true: {
        border: 'none',
      },
    },
  },
})
