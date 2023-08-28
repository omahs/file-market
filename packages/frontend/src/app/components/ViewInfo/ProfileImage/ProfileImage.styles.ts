import { styled } from '../../../../styles'

export const StyledProfileImage = styled('div', {
  width: 120,
  height: 120,
  borderRadius: '50%',
  border: '4px solid $white',
  position: 'relative',
  background: 'white',
})

export const StyledProfileImageContent = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const StyledProfileCameraImage = styled('img', {
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(120%)',
  },
})
