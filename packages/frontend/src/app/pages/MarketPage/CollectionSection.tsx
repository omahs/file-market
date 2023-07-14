import React from 'react'

import { styled } from '../../../styles'
import { Collection } from '../../../swagger/Api'
import CollectionCard, { StyledCollectionGrid } from '../../components/MarketCard/CollectionCard/CollectionCard'
import { Txt } from '../../UIkit'

const CollectionSectionStyled = styled('div', {
  width: '100%',
  overflowX: 'auto',
})

const HeaderTable = styled(StyledCollectionGrid, {
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

const CardsContainer = styled('div', {
  width: '100%',
  '@lg': {
    width: 'max-content',
  },
})

const CardFlexContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
})

const card: Collection = {
  name: 'Hype',
}

const cards: Collection[] = []
for (let i = 0; i < 30; i++) {
  cards.push(card)
}

export default function CollectionSection() {
  return (
    <CollectionSectionStyled>
      <CardsContainer>
        <HeaderTable>
          <Txt>Collection</Txt>
          <Txt>Items</Txt>
          <Txt>On sale</Txt>
          <Txt>Owners</Txt>
          <Txt>Type of content</Txt>
        </HeaderTable>
        <CardFlexContainer>
          {cards.map((card, i) => (
            <CollectionCard {...card} key={i} />
          ))}
        </CardFlexContainer>
      </CardsContainer>
    </CollectionSectionStyled>
  )
}
