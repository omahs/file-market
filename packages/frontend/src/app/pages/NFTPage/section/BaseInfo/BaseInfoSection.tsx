import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useCurrency } from '../../../../hooks/useCurrency'
import { useMultiChainStore } from '../../../../hooks/useMultiChainStore'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Flex, Link, textVariant } from '../../../../UIkit'
import { Params } from '../../../../utils/router'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'

const NftName = styled('h1', {
  ...textVariant('h3').true,
  fontWeight: '600',
  color: '$gray800',
  marginBottom: '$3',
})

export const NftLicence = styled('span', {
  display: 'flex',
  gap: '4px',
})

const BaseInfoSection = () => {
  const { collectionAddress, tokenId, chainName } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const multiChainStore = useMultiChainStore()

  const { formatRoyalty } = useCurrency()

  const transactionUrl = useMemo(() => {
    return `https://filfox.info/en/message/${token?.mintTxHash}`
  }, [token?.mintTxHash])

  return (
    <GridBlock style={{ gridArea: 'BaseInfo' }}>
      <NftName>{token?.name}</NftName>
      <Flex flexDirection='column' gap='$2' alignItems='start'>
        <Flex flexDirection='row' gap='$2' alignItems='center'>
          <img src={multiChainStore.getChainByName(chainName)?.img} style={{ width: '20px', height: '20px' }} />
          {token?.mintTxTimestamp && (
            <Link
              iconRedirect
              href={transactionUrl ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
              target='_blank'
              style={{ fontSize: '14px', lineHeight: '20px' }}
            >
              Minted on
              {' '}
              {new Date(token?.mintTxTimestamp * 1000).toDateString().substring(4)}
            </Link>
          )}
        </Flex>
        {token?.license && (
          <NftLicence>
            <PropertyTitle style={{ fontSize: '14px', lineHeight: '20px', marginBottom: 0 }}>License: </PropertyTitle>
            <Link
              iconRedirect
              href={'https://creativecommons.org/licenses/'}
              target='_blank'
              style={{ fontSize: '14px', lineHeight: '20px' }}
            >
              {token?.license}
            </Link>
          </NftLicence>
        )}
        {!!token?.royalty && (
          <PropertyTitle style={{ fontSize: '14px', lineHeight: '20px', marginBottom: 0 }}>
            Creator’s royalty:
            {' '}
            {formatRoyalty(token.royalty)}
            %
          </PropertyTitle>
        )}
      </Flex>
    </GridBlock>
  )
}

export default BaseInfoSection
