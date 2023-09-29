import { type PressEvent } from '@react-types/shared/src/events'
import { type FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { type Transfer } from '../../../../../../swagger/Api'
import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import {
  bufferToEtherHex,
  hexToBuffer,
  useApproveTransfer,
  useHiddenFileProcessorFactory,
} from '../../../../../processing'
import { type TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { type ActionButtonProps } from './types/types'

export type ButtonApproveTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  transfer?: Transfer
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({
  tokenFullId, transfer, isDisabled,
}) => {
  const { approveTransfer, ...statuses } = useApproveTransfer()
  const { isLoading } = statuses
  const { transferStore } = useStores()
  const factory = useHiddenFileProcessorFactory()
  const { address } = useAccount()
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have granted hidden file access to the buyer',
    loadingMsg: 'Sending an encrypted encryption password',
  })

  const encryptedPassword = useMemo(async () => {
    if (address && tokenFullId && transfer?.publicKey) {
      const owner = await factory.getOwner(address, tokenFullId.collectionAddress, +tokenFullId.tokenId)
      const encryptedFilePassword = await owner.encryptFilePassword(hexToBuffer(transfer?.publicKey))

      return bufferToEtherHex(encryptedFilePassword)
    }
  }, [address, tokenFullId, transfer])

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={wrapAction(async () => {
          const receipt = await approveTransfer({
            tokenId: tokenFullId.tokenId,
            publicKey: transfer?.publicKey,
          })
          const encryptedPasswordRes = await encryptedPassword
          if (receipt?.blockNumber && encryptedPasswordRes) {
            transferStore.onTransferPasswordSet(BigInt(tokenFullId.tokenId), encryptedPasswordRes, receipt?.blockNumber)
          }
        })}
      >
        Transfer hidden file
      </Button>
    </>
  )
}
