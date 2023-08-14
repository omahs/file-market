import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import SettingsButton from '../../components/ViewInfo/SettingsButton/SettingsButton'
import { useCollectionAndTokenListStore } from '../../hooks'
import { useTransfersHistoryStore } from '../../hooks/useTransfersHistory'
import { useUserTransferStore } from '../../hooks/useUserTransfers'
import { Button, gradientPlaceholderImg, PageLayout, TabItem, Tabs, Txt } from '../../UIkit'
import { TabsContainer } from '../../UIkit/Tabs/TabsContainer'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { Params } from '../../utils/router'
import CopyImg from './img/CopyIcon.svg'
import EthereumImg from './img/EthereumIcon.svg'
import { AddressesButtonsContainer, Background, GrayOverlay, Inventory, Profile, ProfileHeader, ProfileImage, ProfileName } from './ProfilePage.styles'

const ProfilePage: React.FC = observer(() => {
  const { profileAddress } = useParams<Params>()
  const { address: currentAddress } = useAccount()

  const transferHistoryStore = useTransfersHistoryStore(profileAddress)
  const collectionAndTokenListStore = useCollectionAndTokenListStore(profileAddress)
  const userTransferStore = useUserTransferStore(profileAddress)

  const isOwner = useMemo(() => {
    return currentAddress === profileAddress
  }, [profileAddress])

  const tabs = useMemo(() => {
    const tabs: TabItem[] = [
      {
        value: 'Owned',
        label: 'Owned',
        url: 'owned',
        amount: collectionAndTokenListStore.data.tokensTotal ?? 0,
      },
      {
        value: 'history',
        label: 'History',
        url: 'history',
        amount: transferHistoryStore.total,
      },
    ]

    if (isOwner) {
      tabs.push({
        amount: userTransferStore.total,
        url: 'transfers',
        value: 'transfers',
        label: 'Transfers',
      })
    }

    return tabs
  }, [collectionAndTokenListStore.data.tokensTotal, transferHistoryStore.tableRows, userTransferStore.total])

  return (
    <GrayOverlay>
      <PageLayout isHasSelectBlockChain>
        <Background />
        <Profile>
          <ProfileHeader>
            <ProfileImage
              src={getProfileImageUrl(profileAddress ?? '')}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = gradientPlaceholderImg
              }}
            />
            <ProfileName>{reduceAddress(profileAddress ?? '')}</ProfileName>
          </ProfileHeader>
          {isOwner && <SettingsButton />}
        </Profile>
        <AddressesButtonsContainer>
          <Button settings>
            <img src={EthereumImg} />
            <Txt primary2>ethereum address</Txt>
            <img src={CopyImg} />
          </Button>
          <Button settings>
            <Txt primary2>f4 address</Txt>
            <img src={CopyImg} />
          </Button>
        </AddressesButtonsContainer>
      </PageLayout>

      <Inventory>
        <TabsContainer>
          <Tabs tabs={tabs} />
        </TabsContainer>
        <Outlet />
      </Inventory>
    </GrayOverlay>
  )
})

export default ProfilePage
