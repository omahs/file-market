import { type ComponentProps, type ReactNode } from 'react'

import { styled } from '../../../styles'

interface BoxShadowedProps {
  children: ReactNode
}

const Box = styled('div', {
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  height: 'auto',
  '&::before': {
    position: 'absolute',
    top: '8px',
    left: '8px',
    content: '""',
    width: '100%',
    height: '100%',
    backgroundColor: '#727272',
    opacity: '0.25',
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
  variants: {
    mediumBorderRadius: {
      true: {
        borderRadius: '8px',
      },
    },
    large: {
      true: {
        '&::before': {
          top: '12px',
          left: '12px',
          '@md': {
            top: '10px',
            left: '7px',
          },
          '@sm': {
            top: '8px',
            left: '8px',
          },
        },
      },
    },
    widthInherit: {
      true: {
        width: 'fit-content',
      },
    },
    fullHeight: {
      true: {
        height: '100%',
      },
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
  height: 'auto',
  variants: {
    hoverBlue: {
      true: {
        '&:hover': {
          border: '2px solid #0090FF',
        },
      },
    },
    fullHeight: {
      true: {
        height: '100%',
      },
    },
  },
})

const BoxShadowed = (props: BoxShadowedProps & ComponentProps<typeof BoxContent> & ComponentProps<typeof Box>) => {
  return (
    <Box
      widthInherit={props.widthInherit}
      fullHeight={props.fullHeight}
      large={props.large}
      mediumBorderRadius={props.mediumBorderRadius}
    >
      <BoxContent hoverBlue={props.hoverBlue} fullHeight={props.fullHeight} >{props.children}</BoxContent>
    </Box>
  )
}

export default BoxShadowed
