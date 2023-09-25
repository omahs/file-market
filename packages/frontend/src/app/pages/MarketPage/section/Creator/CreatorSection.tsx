import React from 'react'

import CreatorCard, { type CreatorCardProps } from '../../../../components/MarketCard/CreatorCard'
import bg from '../../img/bg.jpg'
import userImg from '../../img/largerUserImg.jpg'
import { CardsContainer } from '../Nft'

const card: CreatorCardProps = {
  bgImageUrl: bg,
  description: `UnderKong.eth Meta Jedi / Council of
  MetaLegends / Founder of DAOart.
  UnderKong.eth Meta Jedi / Council of MetaLegends / Founder of DAOart.`,
  user: {
    imageUrl: userImg,
    name: 'UnderKong',
    social: '@UnderKong`s twitter',
  },
}

const cards: CreatorCardProps[] = []
for (let i = 0; i < 30; i++) {
  cards.push(card)
}

export default function CreatorSection() {
  return (
    <CardsContainer>
      {cards.map((card, i) => (
        <CreatorCard {...card} key={i} />
      ))}
    </CardsContainer>
  )
}
