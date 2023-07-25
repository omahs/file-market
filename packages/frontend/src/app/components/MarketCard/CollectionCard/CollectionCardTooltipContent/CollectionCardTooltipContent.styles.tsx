import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'

export const CollectionCardTooltipContentStyled = styled('div', {
  borderRadius: '12px',
  border: '2px solid var(--grey-300, #A9ADB1)',
  background: 'white',
  boxShadow: '0px 0px 15px 0px rgba(2, 143, 255, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '10px 16px 16px',
  width: '480px',
  marginRight: '50px',
  '@md': {
    width: '400px',
  },
  '@sm': {
    width: '320px',
  },
})

export const CollectionCardSectionHeader = styled('span', {
  ...textVariant('primary2').true,
  color: '#6B6F76',
  marginBottom: '4px',
},
)

export const CollectionCardBaseTag = styled('div', {
  ...textVariant('primary2').true,
  background: '#EAEAEC',
  color: '$gray800',
  display: 'flex',
  padding: '2px 6px',
  alignItems: 'center',
})

export const CollectionCardSection = styled('div', {})

export const CollectionCardSectionContent = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '4px',
  flexWrap: 'wrap',
})
