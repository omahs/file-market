import { styled } from '../../../../styles'

export const StyledBanner = styled('div', {
  background: 'white',
  width: '100%',
  height: '240px',
  position: 'relative',
})

export const StyledBannerContent = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '16px',
})

export const StyledBannerEditCard = styled('div', {
  cursor: 'pointer',
  color: '#6B6F76',
  background: 'rgba(255, 255, 255, 0.75)',
  boxShadow: '0px 4px 20px 0px rgba(35, 37, 40, 0.05)',
  width: '115px',
  height: '32px',
  '&:hover': {
    filter: 'brightness(120%)',
  },
  position: 'absolute',
  top: '20px',
  right: '51px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
})
