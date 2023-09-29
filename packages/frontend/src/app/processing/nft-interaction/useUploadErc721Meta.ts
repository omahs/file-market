import { useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'

import { type ERC721TokenMetaInput } from '../types'
import { assertAccount, assertSigner } from '../utils'
import { useUploadLighthouse } from './useUploadLighthouse'

export function useUploadErc721Meta() {
  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()
  const { upload, getAccessToken } = useUploadLighthouse()

  return useCallback(async (meta: ERC721TokenMetaInput) => {
    assertSigner(walletClient)
    assertAccount(address)

    const accessToken = await getAccessToken(address, walletClient)

    // Key - property name, that contained files. Value - URI of the uploaded file
    const fileProps: Record<string, string> = Object.create(null)

    for (const key of Object.keys(meta)) {
      // @ts-expect-error
      const value: any = meta[key]
      if (value instanceof Blob) {
        const fileUploaded = await upload(value, accessToken)
        fileProps[key] = fileUploaded.url
      }
    }

    const metaToUpload = JSON.stringify({
      ...meta,
      ...fileProps,
    }, undefined, 2)

    const metaFile = new File([metaToUpload], 'metadata.json', { type: 'text/plain' })

    return upload(metaFile, accessToken)
  }, [walletClient, address])
}
