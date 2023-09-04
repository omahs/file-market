import { useMediaQuery } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import { useAccount } from 'wagmi'

import FileLogo from '../../../assets/FilemarketFileLogo.png'
import { styled } from '../../../styles'
import Banner from '../../components/ViewInfo/Banner/Banner'
import ProfileImage from '../../components/ViewInfo/ProfileImage/ProfileImage'
import SettingsButton from '../../components/ViewInfo/SettingsButton/SettingsButton'
import { useStores } from '../../hooks'
import { useCollectionStore } from '../../hooks/useCollectionStore'
import { useCollectionTokenListStore } from '../../hooks/useCollectionTokenListStore'
import { useConfig } from '../../hooks/useConfig'
import { useMultiChainStore } from '../../hooks/useMultiChainStore'
import { Badge, Container, gradientPlaceholderImg, Link, NavLink, PageLayout, Tabs } from '../../UIkit'
import { TabsContainer } from '../../UIkit/Tabs/TabsContainer'
import { reduceAddress } from '../../utils/nfts'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { Params } from '../../utils/router'
import { Profile, ProfileHeader, ProfileName } from '../ProfilePage/ProfilePage.styles'
import Bio from '../ProfilePage/sections/Bio'

const GrayOverlay = styled('div', {
  backgroundColor: '$gray100',
})

const Badges = styled('div', {
  display: 'grid',
  gap: '$2',
  marginBottom: '$4',
  flexWrap: 'wrap',
  gridTemplateColumns: 'repeat(2, 1fr)',
  '@sm': {
    '& a': {
      width: '100%',
    },
    '& .firstLink': {
      width: '100%',
    },
  },
})

const GridLayout = styled('div', {
  display: 'flex',
})

const GridBlockSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'GridBlock',
  gap: '32px',
  '@md': {
    display: 'none',
  },
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
  const config = useConfig()
  const { pathname: currentPath } = useLocation()

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
  const md = useMediaQuery('(max-width:900px)')

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
            />
            <ProfileName>{collectionName}</ProfileName>
          </ProfileHeader>
          {isOwner && <SettingsButton />}
        </Profile>
        <GridLayout>
          <Badges>
            <NavLink
              to={
                collectionAndNfts.collection?.owner
                  ? `/profile/${collectionAndNfts.collection.owner}`
                  : currentPath
              }
              className={'firstLink'}
            >
              <Badge
                wrapperProps={{
                  fullWidth: true,
                }}
                content={{
                  title: 'Creator',
                  value: reduceAddress(collectionAndNfts.collection?.owner ?? ''),
                }}
                image={{
                  url: getProfileImageUrl(collectionAndNfts.collection?.owner ?? ''),
                  borderRadius: 'circle',
                }}
              />
            </NavLink>
            {collectionAndNfts.collection?.address && (
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href={`${config?.chain.blockExplorers?.default.url}` +
                `/address/${collectionAndNfts.collection?.address}`}
              >
                <Badge content={{ title: config?.chain.blockExplorers?.default.name, value: 'VRG' }} />
              </Link>
            )}
          </Badges>
          <Bio isTitleEmpty text={user?.bio} />
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
