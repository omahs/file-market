import { createTheme, Slide, Tooltip } from '@mui/material'
import React, { useMemo } from 'react'

import { styled } from '../../../../styles'
import { Collection } from '../../../../swagger/Api'
import { useMediaMui } from '../../../hooks/useMediaMui'
import fillLogoSrc from '../../../pages/MarketPage/img/FillLogo.png'
import { textVariant } from '../../../UIkit'
import CollectionCardTooltipContent from './CollectionCardTooltipContent/CollectionCardTooltipContent'
import { getImg } from './helper/Chain/chain'

const theme = createTheme({
  transitions: {
    duration: {
      standard: 300,
    },
  },
})

const StyledCollectionCard = styled('div', {
  borderRadius: '12px',
  border: '2px solid #C9CBCF',
  background: 'white',
  width: '100%',
  padding: '16px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  transition: 'all 0.4s',
  '&:hover': {
    marginTop: '-3px',
    border: '2px solid #898E94',
    boxShadow: '0px 4px 0px 0px rgba(0, 0, 0, 0.25)',
    marginBottom: '3px',
  },
})

const MoreButtonDot = styled('div', {
  width: '3px',
  height: '3px',
  background: '#0090FF',
  borderRadius: '50%',
})

export const StyledCollectionGrid = styled('div', {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '400px 100px 100px 100px 294px',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@lg': {
    gridTemplateColumns: '260px 90px 90px 90px 200px',
  },
  '@sm': {
    gridTemplateColumns: '130px 90px 90px 90px 150px',
  },
})

const InsideContainer = styled('div', {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
})

const Icon = styled('img', {
  height: '100%',
})

const CollectionCardText = styled('span', {
  textAlign: 'left',
  ...textVariant('primary1').true,
  color: '$gray800',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: '100%',
  overflow: 'hidden',
})

const MoreButton = styled('div', {
  height: '24px',
  width: '26px',
  borderRadius: '50%',
  background: '#EAEAEC',
  color: '#0090FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  transform: 'all 0.4s',
  '@sm': {
    width: '31px',
  },
  '&:hover': {
    border: '2px solid #A9ADB1',
  },
})

const CollectionCardTypesText = styled(CollectionCardText, {
  color: '$gray600',
})

export default function CollectionCard({ name }: Collection) {
  const { smValue } = useMediaMui()

  const chainId = '314'

  const chainIcon: string = useMemo(() => {
    return getImg(chainId)
  }, [chainId])

  return (
    <StyledCollectionCard>
      <StyledCollectionGrid>
        <InsideContainer>
          <Icon src={fillLogoSrc} />
          <CollectionCardText>{name}</CollectionCardText>
        </InsideContainer>
        <CollectionCardText>12.3K</CollectionCardText>
        <CollectionCardText>1234</CollectionCardText>
        <CollectionCardText>12345</CollectionCardText>
        <InsideContainer>
          <CollectionCardTypesText>Audio, Video, 3D Model, Categ...</CollectionCardTypesText>
          <Tooltip
            placement={'left'}
            title={<CollectionCardTooltipContent />}
            TransitionComponent={Slide}
            TransitionProps={{
              // @ts-expect-error
              direction: 'left',
            }}
          >
            <MoreButton>
              <MoreButtonDot />
              <MoreButtonDot />
              <MoreButtonDot />
            </MoreButton>
          </Tooltip>
        </InsideContainer>
      </StyledCollectionGrid>
      <img src={chainIcon} style={{ height: '24px' }} />
    </StyledCollectionCard>
  )
}
