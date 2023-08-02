import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'

export const StyledTitleSection = styled('div', {
  ...textVariant('secondary1').true,
  fontSize: '28px',
  fontWeight: '700',
  color: '#2F3134',
  paddingBottom: '8px',
})

export const StyledTitleInput = styled('div', {
  ...textVariant('primary1').true,
  color: '#4E5156',
  marginBottom: '$3',
  display: 'flex',
  gap: '$3',
})

export const StyledSectionContent = styled('div', {
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
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

export const Form = styled('form', {
  maxWidth: '540px',
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
})
