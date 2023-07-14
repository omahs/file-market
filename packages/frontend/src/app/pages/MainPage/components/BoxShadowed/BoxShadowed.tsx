import { ReactNode } from 'react'

import { styled } from '../../../../../styles'

interface BoxShadowedProps {
  children: ReactNode
  fullHeight?: boolean
}

const Box = styled('div', {
  position: 'relative',
  width: '100%',
  '&::before': {
    position: 'absolute',
    top: '8px',
    left: '8px',
    content: '""',
    width: '100%',
    height: '100%',
    backgroundColor: '#C9CBCF',
    borderRadius: '$3',
    zIndex: '1',
    transition: 'all 0.2s ease-in-out',
    '@md': {
      top: '7px',
      left: '7px',
    },
    '@sm': {
      top: '6px',
      left: '6px',
    },
  },
  '&:hover': {
    '&::before': {
      top: 0,
      left: 0,
    },
  },
})

const BoxContent = styled('div', {
  position: 'relative',
  zIndex: '2',
  border: '2px solid #6B6F76',
  borderRadius: '$3',
  overflow: 'hidden',
  backgroundColor: '$white',
})

const BoxShadowed = (props: BoxShadowedProps) => {
  return (
    <Box style={{ height: props.fullHeight ? '100%' : 'auto' }}>
      <BoxContent style={{ height: props.fullHeight ? '100%' : 'auto' }}>{props.children}</BoxContent>
    </Box>
  )
}

export default BoxShadowed
