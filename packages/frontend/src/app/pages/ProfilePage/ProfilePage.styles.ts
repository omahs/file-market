import { styled } from '../../../styles'
import { Container, textVariant, Txt } from '../../UIkit'

export const Background = styled('div', {
  background: 'linear-gradient(135deg, #028FFF 0%, #04E762 100%)',
  width: '100%',
  height: '240px',
  borderRadius: '16px',
})

export const Profile = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

export const ProfileHeader = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '24px',
  marginTop: -60,
  marginLeft: '32px',
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '$3',
  },
})

export const ProfileImage = styled('img', {
  width: 120,
  height: 120,
  borderRadius: '50%',
  border: '4px solid $white',
  background: '$white',
  objectFit: 'fill',
})

export const ProfileName = styled('h2', {
  ...textVariant('h3').true,
  color: '$blue900',
  fontWeight: '600',
  '@sm': {
    fontSize: 'calc(5vw + 10px)',
  },
})

export const GrayOverlay = styled('div', {
  backgroundColor: '$gray100',
})

export const Inventory = styled(Container, {
  paddingTop: '$4',
  paddingBottom: 48,
  backgroundColor: '#F9F9F9',
  borderRadius: '$6 $6 0 0',
  '@md': {
    borderRadius: '$4 $4 0 0',
  },
  boxShadow: '$footer',
  minHeight: 460, // prevent floating footer
})

export const AddressesButtonsContainer = styled('div', {
  marginTop: '24px',
  width: 'max-content',
  display: 'flex',
  gap: '16px',
})

export const StyledSectionTitle = styled(Txt, {
  ...textVariant('primary1').true,
  fontSize: '20px',
  lineHeight: '24px',
})

export const StyledSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})
