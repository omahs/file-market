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
  variants: {
    withHover: {
      true: {
        '&:hover::before': {
          opacity: '0.25',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: 'black',
          opacity: '0',
          transition: 'opacity 0.2s ease-in-out',
        },
      },
    },
  },
})

export const StyledProfileCameraImage = styled('img', {
  position: 'relative',
  zIndex: 2,
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(120%)',
  },
})
