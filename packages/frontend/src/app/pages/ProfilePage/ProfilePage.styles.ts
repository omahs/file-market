import { styled } from '../../../styles'
import { Container, textVariant, Txt } from '../../UIkit'

export const Profile = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  '@sm': {
    justifyContent: 'center',
  },
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
    marginLeft: '0',
  },
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
  width: '445px',
})

export const StyledSectionContent = styled('div', {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
})

export const BioAndLinks = styled('div', {
  display: 'flex',
  marginTop: '32px',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
})
