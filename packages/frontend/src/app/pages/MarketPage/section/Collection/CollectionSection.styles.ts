import { type CSS } from '@stitches/react'

import { styled } from '../../../../../styles'
import { StyledCollectionGrid } from '../../../../components/MarketCard/CollectionCard/CollectionCard.styles'

export const CollectionSectionStyled = styled('div', {
  width: '100%',
  overflowX: 'auto',
})

export const HeaderTable = styled(StyledCollectionGrid, {
  gridTemplateColumns: '416px 100px 100px 100px 294px',
  color: '#A9ADB1',
  marginBottom: '8px',
  paddingRight: '60px',
  '@lg': {
    gridTemplateColumns: '276px 90px 90px 90px 200px',
  },
  '@sm': {
    gridTemplateColumns: '146px 90px 90px 90px 150px',
  },
})

export const CardsContainer = styled('div', {
  width: '100%',
  '@lg': {
    width: 'max-content',
  },
})

export const collectionListCss: CSS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
}
