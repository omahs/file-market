import { type PressEvent } from '@react-types/shared/src/events'
import { type FC } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useReportFraud } from '../../../../../processing'
import { type TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { wrapButtonActionsFunction } from '../../helper/wrapButtonActionsFunction'
import { type ActionButtonProps } from './types/types'

export type ButtonReportFraudTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonReportFraudTransfer: FC<ButtonReportFraudTransferProps> = ({
  tokenFullId,
  isDisabled,
}) => {
  const { reportFraud, ...statuses } = useReportFraud({ ...tokenFullId })
  const { isLoading } = statuses
  const { wrapAction } = wrapButtonActionsFunction<PressEvent>()
  const { transferStore } = useStores()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Fraud reported! Expect a decision within a few minutes',
    loadingMsg: 'Reporting fraud',
  })

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={wrapAction(async () => {
          const receipt = await reportFraud(tokenFullId)
          if (receipt?.blockNumber) {
            transferStore.onTransferFraudReported(BigInt(tokenFullId.tokenId), receipt?.blockNumber)
          }
        })}
      >
        Report fraud
      </Button>
    </>
  )
}
