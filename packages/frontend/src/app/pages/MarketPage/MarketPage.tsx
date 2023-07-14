import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { useLocation } from 'react-router-dom'

import { styled } from '../../../styles'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { PageLayout, Tabs } from '../../UIkit'
import FileBunniesSection from './FileBunnies/FileBunniesSection/FileBunniesSection'

const TabsContainer = styled('div', {
  marginBottom: '$4',
  position: 'relative',
  width: 'max-content',
})

const MarketPage = observer(() => {
  const { data } = useOpenOrderListStore()
  const location = useLocation()
  const isDisabledPaddingContainer = useMemo(() => {
    const currentTabUrl = location?.pathname?.split('/')?.at(-1) ?? ''

    return currentTabUrl === 'collections'
  }, [location])

  return (
    <>
      <FileBunniesSection />
      <PageLayout style={{ paddingTop: '102px' }} collectionPage={isDisabledPaddingContainer}>
        <TabsContainer>
          <Tabs
            tabs={[
              {
                value: 'efts',
                url: '/market/efts',
                amount: data.total ?? 0,
                label: 'EFTs',
              },
              {
                value: 'collections',
                url: '/market/collections',
                amount: data.total ?? 0,
                label: 'Collections',
              },
            ]}
          />
        </TabsContainer>
        <Outlet />
      </PageLayout>
    </>
  )
})
export default MarketPage
