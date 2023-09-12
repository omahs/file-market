import { styled } from '../../../../styles'

export const StyledBanner = styled('div', {
  background: 'white',
  width: '100%',
  height: '240px',
  position: 'relative',
  borderRadius: '16px',
})

export const StyledBannerContent = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  variants: {
    withHover: {
      true: {
        '&:hover::before': {
          opacity: '0.25',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          backgroundColor: 'black',
          opacity: '0',
          transition: 'opacity 0.2s ease-in-out',
        },
      },
    },
  },
})

export const StyledBannerEditCard = styled('div', {
  cursor: 'pointer',
  color: '#6B6F76',
  background: 'rgba(255, 255, 255, 0.75)',
  boxShadow: '0px 4px 20px 0px rgba(35, 37, 40, 0.05)',
  width: '115px',
  height: '32px',
  transition: 'all 0.25s ease-in-out',
  '&:hover': {
    color: '$blue500',
    backgroundColor: '$white',
  },
  position: 'absolute',
  top: '24px',
  right: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
})
