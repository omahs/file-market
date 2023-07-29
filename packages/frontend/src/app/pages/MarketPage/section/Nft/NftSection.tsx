import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { NFTCard } from '../../../../components'
import Plug from '../../../../components/Plug/Plug'
import { useAutorunEffect } from '../../../../hooks/useAutoRunEffect'
import { useOpenOrderListStore } from '../../../../hooks/useOrdersListStore'
import { Button, InfiniteScroll, nftCardListCss, Txt } from '../../../../UIkit'

const NftSection: React.FC = observer(() => {
  const openOrderListStore = useOpenOrderListStore()
  const navigate = useNavigate()

  useAutorunEffect(() => {
    console.log('EFFFECT')
    console.log(openOrderListStore.nftCards)
  }, [openOrderListStore.nftCards])

  return (
    <>
      <InfiniteScroll
        hasMore={openOrderListStore.hasMoreData}
        isLoading={openOrderListStore.isLoading}
        currentItemCount={openOrderListStore.nftCards.length}
        fetchMore={() => openOrderListStore.requestMore()}
        render={({ index }) => {
          console.log('SCROLLLL')
          console.log(openOrderListStore.nftCards)

          return <NFTCard {...openOrderListStore.nftCards[index]} key={index} />
        }}
        listCss={nftCardListCss}
      />
      {!openOrderListStore.nftCards.length && !openOrderListStore.isLoading && (
        <Plug
          header={'There\'s not one thing'}
          mainText={'Be the first and create your first EFT'}
          buttonsBlock={(
            <Button primary onClick={() => navigate('/create')}>
              <Txt primary1>Create</Txt>
            </Button>
          )}
        />
      )}
    </>
  )
})

export default NftSection
