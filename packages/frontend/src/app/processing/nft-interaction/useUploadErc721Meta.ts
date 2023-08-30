import { useCallback } from 'react'
import { useAccount, useSigner } from 'wagmi'

import { ERC721TokenMetaInput } from '../types'
import { useUploadLighthouse } from './useUploadLighthouse'

export function useUploadErc721Meta() {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const upload = useUploadLighthouse()

  return useCallback(async (meta: ERC721TokenMetaInput) => {
    // Key - property name, that contained files. Value - URI of the uploaded file
    const fileProps: Record<string, string> = Object.create(null)

    for (const key of Object.keys(meta)) {
      // @ts-expect-error
      const value: any = meta[key]
      if (value instanceof Blob) {
        const fileUploaded = await upload(value)
        fileProps[key] = fileUploaded.url
      }
    }

    const metaToUpload = JSON.stringify({
      ...meta,
      ...fileProps,
    }, undefined, 2)

    const metaFile = new File([metaToUpload], 'metadata.json', { type: 'text/plain' })

    return upload(metaFile)
  }, [signer, address])
}
