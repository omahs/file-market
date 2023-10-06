import { ZeroAddress } from '../../utils/constants'

export function ensureAddress(address: string | undefined): `0x${string}` {
  return (address || ZeroAddress) as `0x${string}`
}
