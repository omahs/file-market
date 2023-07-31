import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Collection } from '../../../../../swagger/Api'
import CollectionCard from '../../../../components/MarketCard/CollectionCard/CollectionCard'
import Plug from '../../../../components/Plug/Plug'
import { useCollectionsListStore } from '../../../../hooks/useCollectionsListStore'
import { Button, InfiniteScroll, Txt } from '../../../../UIkit'
import { CardsContainer, collectionListCss, CollectionSectionStyled, HeaderTable } from './CollectionSection.styles'

const CollectionSection = observer(() => {
  const collectionListStore = useCollectionsListStore()
  const navigate = useNavigate()

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
        <InfiniteScroll
          hasMore={collectionListStore.hasMoreData}
          isLoading={collectionListStore.isLoading}
          currentItemCount={collectionListStore.data.collections?.length ?? 0}
          fetchMore={() => collectionListStore.requestMore()}
          render={({ index }) => <CollectionCard {...collectionListStore.data.collections?.[index] as Collection} />}
          listCss={collectionListCss}
        />
        {!collectionListStore.data.collections?.length && !collectionListStore.isLoading && (
          <Plug
            header={'There\'s not one thing'}
            mainText={'Be the first and create your first collection'}
            buttonsBlock={(
              <Button primary onClick={() => navigate('/create/collection')}>
                <Txt primary1>Create</Txt>
              </Button>
            )}
          />
        )}
      </CardsContainer>
    </CollectionSectionStyled>
  )
})

export default CollectionSection
