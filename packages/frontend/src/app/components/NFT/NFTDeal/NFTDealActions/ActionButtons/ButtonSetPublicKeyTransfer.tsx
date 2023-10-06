import { type PressEvent } from '@react-types/shared/src/events'
import { type FC, useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import {
  bufferToEtherHex,
  useHiddenFileProcessorFactory,
  useSeedProvider,
  useSetPublicKey,
} from '../../../../../processing'
import { type TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { type ActionButtonProps } from './types/types'

export type ButtonSetPublicKeyTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonSetPublicKeyTransfer: FC<ButtonSetPublicKeyTransferProps> = ({
  tokenFullId,
  isDisabled,
}) => {
  const { setPublicKey, ...statuses } = useSetPublicKey()
  const { isLoading } = statuses
  const { address } = useAccount()
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { seedProvider } = useSeedProvider(address)
  const { transferStore } = useStores()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Public key was sent. The owner can now give you access to the hidden file.',
    loadingMsg: 'Sending keys, so owner could encrypt the file password and transfer it to you',
  })

  const getPublicKeyHex = useCallback(async () => {
    if (address && tokenFullId && seedProvider?.seed) {
      const factory = useHiddenFileProcessorFactory()
      const buyer = await factory.getBuyer(address, tokenFullId.collectionAddress, +tokenFullId.tokenId)
      const publicKey = await buyer.initBuy()

      return bufferToEtherHex(publicKey)
    }
  }, [address, tokenFullId.collectionAddress, tokenFullId.tokenId, seedProvider?.seed])

  const onPress = wrapAction(async () => {
    const receipt = await setPublicKey(tokenFullId)
    const publicKeyHexRes = await getPublicKeyHex()
    if (receipt?.blockNumber && publicKeyHexRes) {
      transferStore.onTransferPublicKeySet(BigInt(tokenFullId.tokenId), publicKeyHexRes, receipt?.blockNumber)
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
        Accept transfer
      </Button>
    </>
  )
}
