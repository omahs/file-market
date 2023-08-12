import { styled } from '../../../../../styles'
import { FormControl, textVariant } from '../../../../UIkit'

export const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4',
})

export const Label = styled('label', {
  ...textVariant('primary1').true,
  lineHeight: '16px',
  marginBottom: '$2',
  color: '$gray800',
  display: 'block',
  variants: {
    paddingL: {
      true: {
        paddingLeft: '$3',
        '@sm': {
          paddingLeft: 0,
        },
      },
    },
  },
})

export const TitleGroup = styled(FormControl, {
  marginBottom: '$4',
})

export const TextBold = styled('span', {
  ...textVariant('primary1').true,
  fontSize: '12px',
  fontWeight: 600,
})

export const TextGray = styled('span', {
  color: '$gray400',
})

export const LabelWithCounter = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const LetterCounter = styled('span', {
  display: 'block',
  ...textVariant('secondary3').true,
  color: '$gray400',
})

export const Form = styled('form', {
  maxWidth: 'calc($breakpoints$sm + 32px)',
  marginLeft: 'auto',
  marginRight: 'auto',
})

export const ButtonContainer = styled('div', {
  paddingTop: '$3',
  paddingLeft: '$3',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  paddingBottom: '90px',
  '@md': {
    paddingBottom: '70px',
  },
  '@sm': {
    paddingLeft: 0,
    justifyContent: 'center',
  },
})

export const Description = styled('div', {
  ...textVariant('secondary1').true,
  fontSize: '14px',
  lineHeight: '18px',
  color: '$gray600',
  marginBottom: '$3',
  variants: {
    secondary: {
      true: {
        ...textVariant('primary1').true,
        fontSize: '14px',
        fontWeight: '400',
      },
    },
  },
})
