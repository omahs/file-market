import React from 'react'
import { useLocation } from 'react-router'

import { styled } from '../../../../styles'
import { CollectionData } from '../../../../swagger/Api'
import { useConfig } from '../../../hooks/useConfig'
import { Badge, Link, NavLink } from '../../../UIkit'
import { getProfileImageUrl, reduceAddress } from '../../../utils/nfts'

const StyledBadges = styled('div', {
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

interface IBadges {
  collectionData: CollectionData
}

const Badges = ({ collectionData }: IBadges) => {
  const config = useConfig()
  const { pathname: currentPath } = useLocation()

  return (
    <StyledBadges>
      <NavLink
        to={
          collectionData.collection?.owner
            ? `/profile/${collectionData.collection.owner}`
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
            value: reduceAddress(collectionData.collection?.owner ?? ''),
          }}
          image={{
            url: getProfileImageUrl(collectionData.collection?.owner ?? ''),
            borderRadius: 'circle',
          }}
        />
      </NavLink>
      {collectionData.collection?.address && (
        <Link
          target='_blank'
          rel='noopener noreferrer'
          href={`${config?.chain.blockExplorers?.default.url}` +
            `/address/${collectionData.collection?.address}`}
        >
          <Badge
            wrapperProps={{
              fullWidth: true,
            }}
            content={{ title: config?.chain.blockExplorers?.default.name, value: 'VRG' }}
          />
        </Link>
      )}
    </StyledBadges>
  )
}

export default Badges
