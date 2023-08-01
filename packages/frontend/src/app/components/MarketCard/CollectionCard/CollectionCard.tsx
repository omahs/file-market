import { Slide, ThemeProvider, Tooltip } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FileLogo from '../../../../assets/FilemarketFileLogo.png'
import { Collection } from '../../../../swagger/Api'
import { IMultiChainConfig } from '../../../config/multiChainConfigType'
import { useCurrentBlockChain } from '../../../hooks/useCurrentBlockChain'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'
import { gradientPlaceholderImg, Txt } from '../../../UIkit'
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

export default function CollectionCard({ name, address, image, type, chainId, ordersCount, ownersCount, tokensCount, contentTypes }: Collection) {
  const [isShowNumber, setIsShowNumber] = useState<boolean>(false)
  const navigate = useNavigate()
  const currentBlockChain = useCurrentBlockChain()
  const multiChainStore = useMultiChainStore()
  const { smValue, mdValue } = useMediaMui()
  const chain: IMultiChainConfig | undefined = useMemo(() => {
    return multiChainStore.getChainById(+(chainId ?? 0))
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
      onClick={() => { navigate(`/${currentBlockChain.chain?.name}/collection/${address}`) }}
    >
      <StyledCollectionGrid>
        <InsideContainer>
          <Icon src={collectionImgUrl} />
          <CollectionCardText>{name}</CollectionCardText>
        </InsideContainer>
        <CollectionCardText>{isShowNumber ? tokensCount : cutNumber(tokensCount)}</CollectionCardText>
        <CollectionCardText>{isShowNumber ? ordersCount : cutNumber(ordersCount)}</CollectionCardText>
        <CollectionCardText>{isShowNumber ? ownersCount : cutNumber(ownersCount)}</CollectionCardText>
        <InsideContainer>
          <CollectionCardTypesText>{contentTypes?.categories?.join(', ')}</CollectionCardTypesText>
          <ThemeProvider theme={theme}>
            <Tooltip
              placement={'left'}
              title={<CollectionCardTooltipContent categories={contentTypes?.categories} files={contentTypes?.fileExtensions} />}
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
      <Tooltip title={<Txt primary2>{chain?.chain.name}</Txt>}><img src={chain?.img} style={{ height: '24px' }} /></Tooltip>
    </StyledCollectionCard>
  )
}
