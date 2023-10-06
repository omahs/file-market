import { getAddress } from 'viem'
import { useAccount } from 'wagmi'

import { type Transfer } from '../../../swagger/Api'

export function useIsBuyer(transfer: Transfer | undefined): boolean {
  const { address } = useAccount()

  return Boolean(address && transfer?.to && getAddress(address) === getAddress(transfer.to))
}
