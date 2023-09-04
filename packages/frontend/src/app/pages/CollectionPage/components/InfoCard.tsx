import React, { ReactNode, useMemo } from 'react'

import { styled } from '../../../../styles'
import { Collection } from '../../../../swagger/Api'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'
import { textVariant, Txt } from '../../../UIkit'
import { cutNumber } from '../../../utils/number'

const StyledInfoCard = styled('div', {
  display: 'flex',
  padding: '24px 32px',
  flexDirection: 'column',
  gap: '12px',
  borderRadius: '16px',
  border: '2px solid #EAEAEC',
  background: '#FFF',
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
})

const InfoCard = (collection?: Collection) => {
  const multiChainStore = useMultiChainStore()

  const chain = useMemo(() => {
    if (!collection?.chainId) return

    return multiChainStore.getChainById(+collection.chainId)
  }, [collection])

  const data: Array<{ title: string, value?: ReactNode }> | undefined = useMemo(() => {
    if (!collection) return

    return [
      {
        title: 'Volume',
        value: parseFloat(collection.salesVolume ?? '0').toFixed(2),
      },
      {
        title: 'Floor price',
        value: parseFloat(collection.floorPrice ?? '0').toFixed(2),
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
