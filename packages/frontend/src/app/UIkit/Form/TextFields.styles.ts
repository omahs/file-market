import { keyframes, styled } from '../../../styles'
import { textVariant } from '../Txt'

export const glow = keyframes({
  '0%': {
    outline: '1px solid rgba(56, 188, 201, 0.7);',
    boxShadow: '0px 0px 10px rgba(2, 143, 255, 0.5)',
  },
  '100%': {
    outline: '1px solid rgba(8, 141, 250, 0.7);',
    boxShadow: '0px 0px 15px #028FFF',
  },
})

export const textFieldsStyles = {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: 48,
  paddingLR: '$3',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  outline: '1px solid $gray600',
  ...textVariant('primary1').true,
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '19px',
  color: '$blue900',
  border: '2px solid transparent',
  transition: 'outline 0.25s ease-in-out, box-shadow 0.3s ease-in-out',
  width: '100%',

  '&:placeholder': {
    color: '#656668',
    ...textVariant('primary1').true,
    fontWeight: '400',
  },
  '&:hover': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '1px solid $blue500',
  },
  '&:focus': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`,
  },
  '&:focus-within': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`,
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button,': {
    appearance: 'none',
  },
  variants: {
    isError: {
      true: {
        outline: ' 1px solid $red !important',
        animation: 'none !important',
      },
    },
    isNotification: {
      true: {
        outline: ' 2px solid #0090FF; !important',
        animation: 'none !important',
      },
    },
    isDisabledFocusStyle: {
      true: {
        '&:focus': {
          boxShadow: 'none',
        },
      },
    },
    withoutDefaultBorder: {
      true: {
        outline: 'none',
      },
    },
    settings: {
      true: {
        outline: '2px solid #C9CBCF',
        padding: '8px 16px',
        borderRadius: '12px',
        color: '#6B6F76',
        '@md': {
          height: 44,
          fontSize: '15px',
        },
        '@sm': {
          height: 42,
          fontSize: '13px',
        },
        '@xs': {
          height: 40,
          fontSize: '12px',
        },
      },
    },
    textStartInput: {
      true: {
        '&:focus': {
          boxShadow: 'none',
          outline: 'inherit',
          animation: 'none',
        },
        '&:focus-within': {
          boxShadow: 'none',
          outline: 'inherit',
          animation: 'none',
        },
        '&:hover': {
          boxShadow: 'none',
          outline: 'none',
          animation: 'none',
        },
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
      },
    },
  },
}

export const StyledTextFieldsContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  background: 'none',
})

export const StyledErrorMessage = styled('div', {
  textAlign: 'left',
  padding: '24px 16px 12px',
  background: 'rgba(197, 75, 92, 0.05)',
  border: '1px solid rgba(197, 75, 92, 0.25)',
  borderRadius: '0px 0px 16px 16px',
  marginTop: '-12px',
  color: '$red500',
})

export const StyledAfterContainer = styled('div', {
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  fontWeight: 600,
  color: '$gray600',
})

export const StyledNotificationMessage = styled('div', {
  textAlign: 'left',
  padding: '24px 16px 12px',
  background: 'rgba(0, 144, 255, 0.05)',
  border: '1px solid rgba(0, 144, 255, 0.25)',
  borderRadius: '0px 0px 16px 16px',
  marginTop: '-12px',
  color: '#6B6F76',
})

export const StyledRightContent = styled('div', {
  position: 'absolute',
  color: '$gray400',
  ...textVariant('primary1').true,
  fontWeight: '600',
  top: '16px',
  right: '12px',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(120%)',
  },
})
