import { BigNumber } from 'ethers'
import React, { ReactNode, useMemo } from 'react'

import { styled } from '../../../../styles'
import { Collection } from '../../../../swagger/Api'
import { useCurrency } from '../../../hooks/useCurrency'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'
import { textVariant, Txt } from '../../../UIkit'
import { cutNumber } from '../../../utils/number'

const StyledInfoCard = styled('div', {
  display: 'flex',
  width: '445px',
  padding: '24px 32px',
  flexDirection: 'column',
  gap: '12px',
  borderRadius: '16px',
  border: '2px solid #EAEAEC',
  background: '#FFF',
  '@sm': {
    width: '100%',
  },
})

const StyledTextLine = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
})

const StyledTitleTextLine = styled(Txt, {
  ...textVariant('primary1').true,
  color: '#4E5156',
})

const StyledTextTextLine = styled(Txt, {
  ...textVariant('primary1').true,
  color: '#1D1E20',
})

const StyledContainerValueTextLine = styled('div', {
  display: 'flex',
  gap: '8px',
  '& img': {
    width: '20px',
    height: '20px',
  },
})

const InfoCard = ({ collection }: { collection?: Collection }) => {
  const multiChainStore = useMultiChainStore()
  const { formatCurrency } = useCurrency()

  const chain = useMemo(() => {
    if (!collection?.chainId) return

    return multiChainStore.getChainById(+collection.chainId)
  }, [collection])

  const data: Array<{ title: string, value?: ReactNode }> | undefined = useMemo(() => {
    if (!collection) return

    return [
      {
        title: 'Volume',
        value: formatCurrency(BigNumber.from(collection.salesVolume ?? '0')),
      },
      {
        title: 'Floor price',
        value: formatCurrency(BigNumber.from(collection.floorPrice ?? '0')),
      },
      {
        title: 'Items',
        value: cutNumber(collection.tokensCount),
      },
      {
        title: 'On sale',
        value: cutNumber(collection.ordersCount),
      },
      {
        title: 'Owners',
        value: cutNumber(collection.ownersCount),
      },
      {
        title: 'Blockchain',
        value: <StyledContainerValueTextLine>
          <img src={chain?.img} />
          <Txt>{chain?.chain.name}</Txt>
               </StyledContainerValueTextLine>,
      },
    ]
  }, [collection])

  return (
    <StyledInfoCard>
      {data?.map((item, index) => {
        return (
          <StyledTextLine key={index}>
            <StyledTitleTextLine>{item.title}</StyledTitleTextLine>
            <StyledTextTextLine>{item.value}</StyledTextTextLine>
          </StyledTextLine>
        )
      })}
    </StyledInfoCard>
  )
}

export default InfoCard
