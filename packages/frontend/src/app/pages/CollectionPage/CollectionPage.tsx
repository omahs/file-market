import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet, useParams } from 'react-router'
import { useAccount } from 'wagmi'

import FileLogo from '../../../assets/FilemarketFileLogo.png'
import { styled } from '../../../styles'
import Banner from '../../components/ViewInfo/Banner/Banner'
import ProfileImage from '../../components/ViewInfo/ProfileImage/ProfileImage'
import SettingsButton from '../../components/ViewInfo/SettingsButton/SettingsButton'
import { useStores } from '../../hooks'
import { useCollectionStore } from '../../hooks/useCollectionStore'
import { useCollectionTokenListStore } from '../../hooks/useCollectionTokenListStore'
import { useMultiChainStore } from '../../hooks/useMultiChainStore'
import { Container, gradientPlaceholderImg, PageLayout, Tabs } from '../../UIkit'
import { TabsContainer } from '../../UIkit/Tabs/TabsContainer'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { Params } from '../../utils/router'
import { Profile, ProfileHeader, ProfileName } from '../ProfilePage/ProfilePage.styles'
import Bio from '../ProfilePage/sections/Bio'
import Badges from './components/Badges'
import InfoCard from './components/InfoCard'

const GrayOverlay = styled('div', {
  backgroundColor: '$gray100',
})

const GridLayout = styled('div', {
  width: '100%',
  display: 'flex',
  marginTop: '40px',
  justifyContent: 'space-between',
  '@md': {
    flexDirection: 'column',
  },
})

const GridBlockSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'GridBlock',
  gap: '24px',
})

const Inventory = styled(Container, {
  paddingTB: '$4',
  backgroundColor: '$white',
  borderRadius: '$6 $6 0 0',
  '@md': {
    borderRadius: '$4 $4 0 0',
  },
  boxShadow: '$footer',
  minHeight: 460, // prevent floating footer
})

const CollectionPage = observer(() => {
  const { collectionAddress, chainName } = useParams<Params>()
  const { userStore } = useStores()
  const { address } = useAccount()
  useMultiChainStore()
  const { data: collectionAndNfts } = useCollectionTokenListStore(collectionAddress, chainName)
  const collectionStore = useCollectionStore(collectionAddress, chainName)

  const collectionImgUrl = useMemo(() => {
    if (collectionAndNfts?.collection?.type === 'Public Collection') return FileLogo
    if (collectionAndNfts?.collection?.image) { return getHttpLinkFromIpfsString(collectionAndNfts.collection.image) }

    return gradientPlaceholderImg
  }, [collectionAndNfts?.collection])

  const collectionName = useMemo(() => {
    if (collectionAndNfts?.collection?.type === 'Public Collection') {
      return 'Public Collection'
    }

    return collectionAndNfts?.collection?.name
  }, [collectionAndNfts?.collection])

  const isOwner = useMemo(() => {
    return collectionStore.collection?.owner === address
  }, [collectionStore.collection, address])

  const { user } = userStore
  const { collection } = collectionStore

  return (
    <GrayOverlay>
      <PageLayout>
        <Banner
          isOwner={isOwner}
          src={user?.bannerUrl ? getHttpLinkFromIpfsString(user?.bannerUrl) : undefined}
        />
        <Profile>
          <ProfileHeader>
            <ProfileImage
              src={user?.avatarUrl ? getHttpLinkFromIpfsString(user?.avatarUrl) : getProfileImageUrl(collectionAddress ?? '')}
              isOwner={isOwner}
              isCollection
            />
            <ProfileName>{collectionName}</ProfileName>
          </ProfileHeader>
          {isOwner && <SettingsButton />}
        </Profile>
        <GridLayout>
          <GridBlockSection>
            <Badges collectionData={collectionAndNfts} />
            <Bio isTitleEmpty text={user?.bio} />
          </GridBlockSection>
          <InfoCard collection={collection} />
        </GridLayout>
      </PageLayout>
      <Inventory>
        <TabsContainer>
          <Tabs
            tabs={[
              {
                value: 'efts',
                label: 'EFTs',
                url: 'efts',
                amount: collectionAndNfts?.total ?? 0,
              },
            ]}
            isSmall
          />
        </TabsContainer>
        <Outlet />
      </Inventory>
    </GrayOverlay>
  )
})

export default CollectionPage
