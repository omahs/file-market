import { utils } from 'ethers'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Banner from '../../components/ViewInfo/Banner/Banner'
import ProfileImage from '../../components/ViewInfo/ProfileImage/ProfileImage'
import SettingsButton from '../../components/ViewInfo/SettingsButton/SettingsButton'
import { useCollectionAndTokenListStore, useStores } from '../../hooks'
import { useProfileStore } from '../../hooks/useProfileStore'
import { useTransfersHistoryStore } from '../../hooks/useTransfersHistory'
import { useUserTransferStore } from '../../hooks/useUserTransfers'
import { Button, PageLayout, TabItem, Tabs, Txt } from '../../UIkit'
import { TabsContainer } from '../../UIkit/Tabs/TabsContainer'
import { copyToClipboard } from '../../utils/clipboard/clipboard'
import { getHttpLinkFromIpfsString } from '../../utils/nfts'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { Params } from '../../utils/router'
import CopyImg from './img/CopyIcon.svg'
import EthereumImg from './img/EthereumIcon.svg'
import {
  AddressesButtonsContainer,
  BioAndLinks,
  GrayOverlay,
  Inventory,
  Profile,
  ProfileHeader,
  ProfileName,
} from './ProfilePage.styles'
import Bio from './sections/Bio'
import Links from './sections/Links'

const ProfilePage: React.FC = observer(() => {
  const { profileAddress } = useParams<Params>()
  const { userStore } = useStores()
  const profileStore = useProfileStore(profileAddress)
  const profileAddressMemo = useMemo(() => {
    if (profileAddress?.[0] === '0' && profileAddress?.[1] === 'x') return profileAddress

    return profileStore.user?.address
  }, [profileAddress, profileStore.user])

  const { address: currentAddress } = useAccount()
  const transferHistoryStore = useTransfersHistoryStore(profileAddressMemo)
  const collectionAndTokenListStore = useCollectionAndTokenListStore(profileAddressMemo)
  const userTransferStore = useUserTransferStore(profileAddressMemo)

  const isOwner = useMemo(() => {
    console.log(profileAddressMemo)
    console.log(currentAddress)

    if (!currentAddress || !profileAddressMemo) return false

    return utils.getAddress(currentAddress ?? '') === utils.getAddress(profileAddressMemo ?? '')
  }, [profileAddressMemo, currentAddress])

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

  const user = useMemo(() => {
    if (isOwner && userStore.user) return userStore.user

    return profileStore.user
  }, [isOwner, profileStore.user, userStore.user])

  return (
    <GrayOverlay>
      <PageLayout isHasSelectBlockChain>
        <Banner
          isOwner={isOwner}
          src={user?.bannerUrl ? getHttpLinkFromIpfsString(user?.bannerUrl) : undefined}
        />
        <Profile>
          <ProfileHeader>
            <ProfileImage
              src={user?.avatarUrl ? getHttpLinkFromIpfsString(user?.avatarUrl) : getProfileImageUrl(profileAddress ?? '')}
              isOwner={isOwner}
            />
            <ProfileName>{user?.name ?? reduceAddress(profileAddressMemo ?? '')}</ProfileName>
          </ProfileHeader>
          {isOwner && <SettingsButton />}
        </Profile>
        <AddressesButtonsContainer>
          <Button
            settings
            onClick={() => {
              copyToClipboard(profileAddressMemo)
            }}
          >
            <img src={EthereumImg} />
            <Txt primary2>{reduceAddress(profileAddressMemo ?? '')}</Txt>
            <img src={CopyImg} />
          </Button>
          {/* <Button settings> */}
          {/*  <Txt primary2>f4 address</Txt> */}
          {/*  <img src={CopyImg} /> */}
          {/* </Button> */}
        </AddressesButtonsContainer>
        <BioAndLinks>
          <Bio text={user?.bio} />
          <Links items={{
            url: user?.websiteUrl,
            twitter: user?.twitter,
            telegram: '@lewinUp',
            discord: 'discordik',
          }}
          />
        </BioAndLinks>
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
