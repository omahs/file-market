import React from 'react'
import { Outlet } from 'react-router'
import { styled } from '../../../styles'
import Badge from '../../components/Badge/Badge'
import { textVariant, Container } from '../../UIkit'
import Tabs, { TabsProps } from '../../UIkit/Tabs/Tabs'
import bg from './img/Gradient.jpg'
import creator from './img/creatorImg.jpg'

const Background = styled('img', {
  width: '100%',
  height: 352
})

const Profile = styled('div', {
  paddingBottom: '$4'
})

const ProfileHeader = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '$3',
  marginTop: -80,
  marginBottom: '$4',
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '$3'
  }
})

const ProfileImage = styled('img', {
  width: 160,
  height: 160,
  borderRadius: '50%',
  border: '8px solid $white'
})

const ProfileName = styled('h2', {
  ...textVariant('h2').true,
  color: '$blue900',
  paddingBottom: '$3',
  '@sm': {
    fontSize: 'calc(5vw + 10px)'
  }
})

const Badges = styled('div', {
  display: 'flex',
  gap: '$2',
  marginBottom: '$4'
})

const GrayOverlay = styled('div', {
  backgroundColor: '$gray100'
})

const ProfileDescription = styled('p', {
  ...textVariant('body3'),
  maxWidth: 540,
  color: '$gray500'
})

const Inventory = styled(Container, {
  paddingTop: '$4',
  backgroundColor: '$white',
  borderTopLeftRadius: 64,
  borderTopRightRadius: 64,
  '@md': {
    borderTopLeftRadius: '$4',
    borderTopRightRadius: '$4'
  }
})

const tabs: Pick<TabsProps, 'tabs'> = {
  tabs: [
    {
      name: 'NFTs',
      url: 'nfts',
      amount: 3
    },
    {
      name: 'Owners',
      url: 'owners',
      amount: 2
    },
    {
      name: 'History',
      url: 'history',
      amount: 3
    }
  ]
}

const TabsContainer = styled('div', {
  marginBottom: '$4'
})

export default function CollectionPage() {
  return (
    <>
      <GrayOverlay>
        <Background src={bg} />

        <Container>
          <Profile>
            <ProfileHeader>
              <ProfileImage src={bg} />
              <ProfileName>VR Glasses</ProfileName>
            </ProfileHeader>

            <Badges>
              <Badge
                content={{ title: 'Creator', value: 'Underkong' }}
                imgUrl={creator}
              />
              <Badge content={{ title: 'Etherscan.io', value: 'VRG' }} />
            </Badges>

            <ProfileDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sodales
              id in facilisis donec. Aliquam sed volutpat posuere pharetra
              viverra lacinia odio amet suscipit. A, quis arcu amet, nunc odio
              suspendisse cursus mauris. Aliquam dictum in ornare odio eget ut
              eleifend etiam.
            </ProfileDescription>
          </Profile>
        </Container>

        <Inventory>
          <TabsContainer>
            <Tabs {...tabs} />
          </TabsContainer>
          <Outlet />
        </Inventory>
      </GrayOverlay>
    </>
  )
}
