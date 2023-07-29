import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { NFTDeal } from '../../../../components'
import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import { useMultiChainStore } from '../../../../hooks/useMultiChainStore'
import { useOrderStore } from '../../../../hooks/useOrderStore'
import { useTransferStore } from '../../../../hooks/useTransferStore'
import { makeTokenFullId } from '../../../../processing'
import { Button } from '../../../../UIkit'
import { Params } from '../../../../utils/router'
import { GridBlock } from '../../helper/styles/style'

const ControlSection = observer(() => {
  const { collectionAddress, tokenId, chainName } = useParams<Params>()
  const { changeNetwork, chain } = useChangeNetwork()
  const multiChainStore = useMultiChainStore()
  const transferStore = useTransferStore(collectionAddress, tokenId, chainName) // watch events is called inside nft page
  const orderStore = useOrderStore(collectionAddress, tokenId, chainName)
  const tokenFullId = useMemo(
    () => makeTokenFullId(collectionAddress, tokenId),
    [collectionAddress, tokenId],
  )

  return (
    <GridBlock>
      {tokenFullId && (
        <>
          {
            chain?.name === chainName ? (
              <NFTDeal
                order={orderStore.data}
                tokenFullId={tokenFullId}
                reFetchOrder={() => {
                  orderStore.reload()
                  transferStore.reload()
                }}
              />
            )
              : (
                <Button
                  primary
                  fullWidth
                  borderRadiusSecond
                  onPress={() => { changeNetwork(multiChainStore.getChainByName(chainName)?.chain.id) }}
                >
                  Change network
                </Button>
              )}
        </>

      )}
    </GridBlock>
  )
})

export default ControlSection
