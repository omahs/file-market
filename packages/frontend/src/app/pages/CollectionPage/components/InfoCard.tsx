import React, { useMemo } from 'react'

import { styled } from '../../../../styles'
import { Collection } from '../../../../swagger/Api'
import { textVariant, Txt } from '../../../UIkit'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'

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

const StyledContainerValueTextLine = styled('div', {
  display: 'flex',
  gap: '8px'
})

const InfoCard = (collection?: Collection) => {
  const multiChainStore = useMultiChainStore()

  const chain = useMemo(() => {
    if (!collection?.chainId) return
    return multiChainStore.getChainById(+collection.chainId)
  }, [collection])

  const data = useMemo(() => {
    if (!collection) return

    return [
      {
        title: 'Volume',
        value: `${collection.salesVolume} `,
      },
      {
        title: 'Floor price',
        value: collection.floorPrice,
      },
      {
        title: 'Items',
        value: collection.tokensCount,
      },
      {
        title: 'On sale',
        value: collection.ordersCount,
      },
      {
        title: 'Owners',
        value: collection.ownersCount,
      },
      {
        title: 'Blockchain',
        value: multiChainStore.getChainById(collection.chainId).,
      },
      {
        title: 'Volume',
        value: collection.salesVolume,
      },

    ]
  }, [collection])

  return (
    <StyledInfoCard />
  )
}

export default InfoCard
