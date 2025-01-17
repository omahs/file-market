import { useMediaQuery } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { Fragment, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../styles'
import { useHiddenFileDownload } from '../../hooks/useHiddenFilesDownload'
import { useSubscribeToEft } from '../../hooks/useSubscribeToEft'
import { useTokenMetaStore } from '../../hooks/useTokenMetaStore'
import { useTokenStore } from '../../hooks/useTokenStore'
import { useTransferStore } from '../../hooks/useTransferStore'
import { useIsBuyer, useIsOwner } from '../../processing'
import { PageLayout } from '../../UIkit'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { type Params } from '../../utils/router'
import { transferPermissions } from '../../utils/transfer/status'
import { PreviewNFTFlow } from './components/PreviewNFTFlow'
import { GridBlock } from './helper/styles/style'
import BaseInfoSection from './section/BaseInfo/BaseInfoSection'
import ControlSection from './section/Contol/ControlSection'
import DescriptionSection from './section/Description/DescriptionSection'
import FileInfoSection from './section/FileInfo/FileInfoSection'
import HomeLandSection from './section/HomeLand/HomeLandSection'
import PropertiesSection from './section/Properties/PropertiesSection'
import TagsSection from './section/Tags/TagsSection'

const NFTPreviewContainer = styled('div', {
  width: '100%',
  height: 686,
  background: '$gradients$background',
  boxSizing: 'content-box',
  '& .blur': {
    width: '100%',
    height: '100%',
    mixBlendMode: 'normal',
    backdropFilter: 'blur(150px)',
    paddingTop: '3px',
  },
  zIndex: '1',
  position: 'relative',
  '@sm': {
    marginTop: '83px',
    height: 365,
  },
})

const MainInfo = styled(PageLayout, {
  display: 'flex', // чтобы можно было дочерним заполнить все пространство
  marginTop: '10px',
  marginBottom: '-80px',
  paddingTB: 48,
  fontSize: '16px',
  gridTemplateColumns: '3fr 1fr',
  columnGap: '$4',
  minHeight: '100%',
  height: 'max-content',
  borderRadius: '$6 $6 0 0',
  top: '-$6',
  boxShadow: '$footer',
  zIndex: '7',
  position: 'relative',
  '@md': {
    height: 'unset',
    borderRadius: '24px 24px 0px 0px',
  },
  '@sm': {
    marginTop: '45px',
  },
})

const GridLayout = styled('div', {
  flexGrow: 1, // чтобы был в высоту родителя
  display: 'grid',
  gap: '32px',
  position: 'relative',
  columnGap: '$4',
  gridTemplateColumns: '3fr 1fr',
  // eslint-disable-next-line
  gridTemplateAreas: "'GridBlock Control'",
  '@md': {
    gridTemplateAreas: "'BaseInfo' 'Control' 'HomeLand' 'Tags' 'Description' 'Properties'",
    gridTemplateColumns: 'unset',
  },
})

const GridBlockSection = styled(GridBlock, {
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'GridBlock',
  gap: '32px',
  '@md': {
    display: 'none',
  },
})

const ControlFileSection = styled('div', {
  height: '100%',
})

const ControlStickyBlock = styled('div', {
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  top: '125px',
  '@md': {
    position: 'relative',
    top: '0',
  },
})

const NFTPage: React.FC = observer(() => {
  useSubscribeToEft()
  const { collectionAddress, tokenId, chainName } = useParams<Params>()
  const transferStore = useTransferStore(collectionAddress, tokenId, chainName)
  const tokenStore = useTokenStore(collectionAddress, tokenId, chainName)
  const tokenMetaStore = useTokenMetaStore(tokenStore.data?.metaUri)
  const files = useHiddenFileDownload(tokenMetaStore, tokenStore.data)
  const { isOwner } = useIsOwner(tokenStore.data)
  const isBuyer = useIsBuyer(transferStore.data)
  const canViewHiddenFiles = isBuyer && transferPermissions.buyer.canViewHiddenFiles(
    transferStore.data,
  )

  const categories: string[] = useMemo(() => {
    let categories: string[] = []
    if (tokenStore.data?.categories) categories = tokenStore.data?.categories
    if (tokenStore.data?.subcategories && tokenStore.data?.subcategories[0] !== '') categories = [...categories, ...tokenStore.data?.subcategories]

    return categories
  }, [tokenStore.data?.categories, tokenStore.data?.subcategories])

  const md = useMediaQuery('(max-width:900px)')
  const MainInfoSectionWrapper = md ? Fragment : GridBlockSection

  return (
    <>
      <NFTPreviewContainer style={{
        backgroundImage: `url(${getHttpLinkFromIpfsString(tokenStore.data?.image ?? '')})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
      }}
      >
        <div className='blur'>
          {
            <PreviewNFTFlow
              getFile={files[0]?.getFile}
              hiddenFile={tokenStore.data?.hiddenFileMeta}
              canViewFile={isOwner || canViewHiddenFiles}
              imageURL={getHttpLinkFromIpfsString(tokenStore.data?.image ?? '')}
            />
          }
        </div>
      </NFTPreviewContainer>
      <MainInfo>
        <GridLayout>
          <MainInfoSectionWrapper>
            <BaseInfoSection />
            <HomeLandSection />
            <TagsSection
              tags={tokenStore.data?.tags}
              categories={categories}
            />
            <DescriptionSection />
            <PropertiesSection properties={tokenStore.data?.properties} />
          </MainInfoSectionWrapper>
          <ControlFileSection style={{ gridArea: 'Control' }}>
            <ControlStickyBlock>
              <ControlSection />
              {(transferStore.data || isOwner) && (
                <FileInfoSection
                  isOwner={isOwner}
                  canViewHiddenFiles={canViewHiddenFiles}
                  files={files}
                  filesMeta={tokenStore.data?.hiddenFileMeta ? [tokenStore.data?.hiddenFileMeta] : []}
                />
              )}
            </ControlStickyBlock>
          </ControlFileSection>
        </GridLayout>
      </MainInfo>
    </>
  )
})

export default NFTPage
