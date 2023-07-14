import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { useLocation } from 'react-router-dom'

import { styled } from '../../../styles'
import { useCollectionsListStore } from '../../hooks/useCollectionsListStore'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { PageLayout, TabItem, Tabs } from '../../UIkit'
import FileBunniesSection from './FileBunnies/FileBunniesSection/FileBunniesSection'

const TabsContainer = styled('div', {
  marginBottom: '$4',
  position: 'relative',
  width: 'max-content',
})

const MarketPage = observer(() => {
  const { data: orderData } = useOpenOrderListStore()
  const { data: collectionsData } = useCollectionsListStore()
  const location = useLocation()
  const isDisabledPaddingContainer = useMemo(() => {
    const currentTabUrl = location?.pathname?.split('/')?.at(-1) ?? ''

    return currentTabUrl === 'collections'
  }, [location])

  const tabs: TabItem[] = useMemo(() => {
    return [
      {
        value: 'efts',
        url: '/market/efts',
        amount: orderData.total ?? 0,
        label: 'EFTs',
      },
      {
        value: 'collections',
        url: '/market/collections',
        amount: collectionsData.total ?? 0,
        label: 'Collections',
      },
    ]
  }, [orderData.total, collectionsData.total])

  return (
    <>
      <FileBunniesSection />
      <PageLayout style={{ paddingTop: '102px' }} collectionPage={isDisabledPaddingContainer}>
        <TabsContainer>
          <Tabs
            tabs={tabs}
          />
        </TabsContainer>
        <Outlet />
      </PageLayout>
    </>
  )
})
export default MarketPage
