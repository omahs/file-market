import { createTheme } from '@mui/material'

import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'

export const theme = createTheme({
  components: {
    // Name of the component
    MuiTooltip: {
      styleOverrides: {
        touch: {
          background: 'none',
          marginRight: '50px',
        },
        tooltip: {
          background: 'none',
          marginRight: '50px',
        },
        tooltipPlacementLeft: {
          marginRight: '50px',
        },
      },
    },
  },
})

export const StyledCollectionCard = styled('div', {
  borderRadius: '12px',
  border: '2px solid #C9CBCF',
  background: 'white',
  width: '100%',
  padding: '16px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  transition: 'all 0.4s',
  cursor: 'pointer',
  '&:hover': {
    marginTop: '-3px',
    border: '2px solid #898E94',
    boxShadow: '0px 4px 0px 0px rgba(0, 0, 0, 0.25)',
    marginBottom: '3px',
  },
})

export const MoreButtonDot = styled('div', {
  width: '3px',
  height: '3px',
  background: '#0090FF',
  borderRadius: '50%',
})

export const StyledCollectionGrid = styled('div', {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '400px 100px 100px 100px 294px',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@lg': {
    gridTemplateColumns: '260px 90px 90px 90px 200px',
  },
  '@sm': {
    gridTemplateColumns: '130px 90px 90px 90px 150px',
  },
})

export const InsideContainer = styled('div', {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
})

export const Icon = styled('img', {
  height: '40px',
  width: '40px',
  borderRadius: '50%',
})

export const CollectionCardText = styled('span', {
  textAlign: 'left',
  ...textVariant('primary1').true,
  color: '$gray800',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: '100%',
  overflow: 'hidden',
})

export const MoreButton = styled('div', {
  height: '24px',
  width: '26px',
  borderRadius: '50%',
  background: '#EAEAEC',
  color: '#0090FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  transform: 'all 0.4s',
  '@sm': {
    width: '31px',
  },
  '&:hover': {
    border: '2px solid #A9ADB1',
  },
})

export const CollectionCardTypesText = styled(CollectionCardText, {
  color: '$gray600',
})
