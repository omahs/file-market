import { md } from 'node-forge'

export const sha256 = (data: ArrayBuffer): ArrayBuffer => {
  const hash = md.sha256.create()
  hash.update(Buffer.from(data).toString('binary'), 'raw')

  return Buffer.from(hash.digest().toHex(), 'hex')
}
