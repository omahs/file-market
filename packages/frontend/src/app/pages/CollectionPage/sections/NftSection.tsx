import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../../styles'
import { NFTCard } from '../../../components'
import Plug from '../../../components/Plug/Plug'
import { useCollectionTokenListStore } from '../../../hooks/useCollectionTokenListStore'
import { Button, CardsSkeletonLoading, Txt } from '../../../UIkit'

export const CardsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '$4',
  justifyContent: 'normal',
  '@md': {
    justifyContent: 'space-around'
  },
  '@sm': {
    justifyContent: 'center'
  },
  paddingBottom: '$3'
})

const NoNftContainer = styled('div', {
  gridColumn: '1/-1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '$3',
  width: '100%'
})

const NftSection = observer(() => {
  const {
    isLoading,
    nftCards
  } = useCollectionTokenListStore()
  const navigate = useNavigate()

  return (
    <CardsContainer>
      <CardsSkeletonLoading isLoading={isLoading} count={5}>
        {nftCards.length ? (
          nftCards.map((card, index) => <NFTCard {...card} key={index} />)
        ) : (
          <NoNftContainer>
            <Plug
              header={'There\'s not one thing'}
              mainText={'Be the first and create your first EFT'}
              buttonsBlock={(
                <Button primary onClick={() => navigate('/create/nft')}>
                  <Txt primary1>Create</Txt>
                </Button>
              )}
            />
          </NoNftContainer>
        )}
      </CardsSkeletonLoading>
    </CardsContainer>
  )
})

export default NftSection
