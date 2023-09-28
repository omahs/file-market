export function ensureAddress(address: string | undefined): `0x${string}` {
  return (address || '0x0000000000000000000000000000000000000000') as `0x${string}`
}
