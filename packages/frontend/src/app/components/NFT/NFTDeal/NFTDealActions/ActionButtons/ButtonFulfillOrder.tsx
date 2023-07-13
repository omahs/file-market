import { PressEvent } from '@react-types/shared/src/events'
import { BigNumber } from 'ethers'
import { observer } from 'mobx-react-lite'
import { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Order } from '../../../../../../swagger/Api'
import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import {
  bufferToEtherHex,
  useFulfillOrder,
  useHiddenFileProcessorFactory,
  useSeedProvider,
} from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { ActionButtonProps } from './types/types'

export type ButtonFulfillOrderProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  order?: Order
}

export const ButtonFulfillOrder: FC<ButtonFulfillOrderProps> = observer(({
  tokenFullId,
  order,
  isDisabled,
}) => {
  const { fulfillOrder, ...statuses } = useFulfillOrder()
  const { isLoading } = statuses
  const { address } = useAccount()
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { transferStore } = useStores()
  const { seedProvider } = useSeedProvider(address)
  const factory = useHiddenFileProcessorFactory()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the EFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order',
  })

  const publicKeyHex = useMemo(async () => {
    if (address && tokenFullId && seedProvider?.seed) {
      const buyer = await factory.getBuyer(address, tokenFullId.collectionAddress, +tokenFullId.tokenId)
      const publicKey = await buyer.initBuy()

      return bufferToEtherHex(publicKey)
    }
  }, [address, tokenFullId, seedProvider?.seed])

  const onPress = wrapAction(async () => {
    const receipt = await fulfillOrder({
      ...tokenFullId,
      price: order?.price,
    })
    const publicKeyHexRes = await publicKeyHex
    if (receipt?.blockNumber && publicKeyHexRes) {
      transferStore.onTransferPublicKeySet(BigNumber.from(tokenFullId.tokenId), publicKeyHexRes, receipt?.blockNumber)
      transferStore.onTransferDraftCompletion(BigNumber.from(tokenFullId.tokenId), receipt?.to, receipt?.blockNumber)
    }
  })

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={onPress}
      >
        Buy now
      </Button>
    </>
  )
})
