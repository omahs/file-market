import { Slide, ThemeProvider, Tooltip } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FileLogo from '../../../../assets/FilemarketFileLogo.png'
import { Collection } from '../../../../swagger/Api'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { gradientPlaceholderImg } from '../../../UIkit'
import { getHttpLinkFromIpfsString } from '../../../utils/nfts'
import { cutNumber } from '../../../utils/number'
import {
  CollectionCardText,
  CollectionCardTypesText,
  Icon,
  InsideContainer,
  MoreButton,
  MoreButtonDot,
  StyledCollectionCard,
  StyledCollectionGrid,
  theme,
} from './CollectionCard.styles'
import CollectionCardTooltipContent from './CollectionCardTooltipContent/CollectionCardTooltipContent'
import { getImg } from './helper/Chain/chain'

export default function CollectionCard({ name, address, image, type }: Collection) {
  const chainId = '314'
  const [isShowNumber, setIsShowNumber] = useState<boolean>(false)
  const navigate = useNavigate()
  const { smValue, mdValue } = useMediaMui()
  const chainIcon: string = useMemo(() => {
    return getImg(chainId)
  }, [chainId])

  const tooltipOffset: number = useMemo(() => {
    if (smValue) return 0
    if (mdValue) return 100

    return 250
  }, [smValue, mdValue])

  const collectionImgUrl = useMemo(() => {
    if (type === 'Public Collection') return FileLogo
    if (image) { return getHttpLinkFromIpfsString(image) }

    return gradientPlaceholderImg
  }, [image, type])

  return (
    <StyledCollectionCard
      onMouseEnter={() => { setIsShowNumber(true) }}
      onMouseLeave={() => { setIsShowNumber(false) }}
      onMouseDown={() => { setIsShowNumber(true) }}
      onMouseUp={() => { setIsShowNumber(false) }}
      onClick={() => { navigate(`/collection/${address}`) }}
    >
      <StyledCollectionGrid>
        <InsideContainer>
          <Icon src={collectionImgUrl} />
          <CollectionCardText>{name}</CollectionCardText>
        </InsideContainer>
        <CollectionCardText>{isShowNumber ? 12345 : cutNumber(12345)}</CollectionCardText>
        <CollectionCardText>{isShowNumber ? 12345 : cutNumber(12345)}</CollectionCardText>
        <CollectionCardText>{isShowNumber ? 12345 : cutNumber(12345)}</CollectionCardText>
        <InsideContainer>
          <CollectionCardTypesText>Audio, Video, 3D Model, Categ...</CollectionCardTypesText>
          <ThemeProvider theme={theme}>
            <Tooltip
              placement={'left'}
              title={<CollectionCardTooltipContent />}
              TransitionComponent={Slide}
              TransitionProps={{
                // @ts-expect-error
                direction: 'left',
              }}
              PopperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, tooltipOffset],
                    },
                  },
                ],
              }}

            >
              <MoreButton>
                <MoreButtonDot />
                <MoreButtonDot />
                <MoreButtonDot />
              </MoreButton>
            </Tooltip>
          </ThemeProvider>
        </InsideContainer>
      </StyledCollectionGrid>
      <img src={chainIcon} style={{ height: '24px' }} />
    </StyledCollectionCard>
  )
}
