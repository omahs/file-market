import lighthouse from '@lighthouse-web3/sdk'
import { Signer } from 'ethers'
import { useCallback } from 'react'
import { useAccount, useSigner } from 'wagmi'

import { lighthouseService } from '../../services/LighthouseService'
import { assertAccount, assertSigner } from '../utils/assert'

export function useUploadLighthouse() {
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const getAccessToken = async (address: string, signer: Signer) => {
    const message = await lighthouseService.getMessage(address)
    const signedMessage = await signer.signMessage(message) // Sign message

    return lighthouseService.getAccessToken(address, signedMessage)
  }

  const upload = useCallback(async (file: File | Blob, accessToken: string) => {
    assertSigner(signer)
    assertAccount(address)

    const uploadFile = async (fileOrBlob: File | Blob) => {
      let file: File
      if (fileOrBlob instanceof Blob && !(fileOrBlob instanceof File)) {
        file = new File([fileOrBlob], 'file')
      } else {
        file = fileOrBlob
      }
      const output = await lighthouse.upload(
        { target: { files: [file] }, persist: () => void 0 },
        accessToken, () => void 0,
      )

      return {
        url: `ipfs://${output.data.Hash}`,
        cid: output.data.Hash,
      }
    }

    return uploadFile(file)
  }, [signer, address])

  const uploadWithoutToken = useCallback(async (file: File | Blob) => {
    assertSigner(signer)
    assertAccount(address)
    const accessToken = await getAccessToken(address, signer)

    return upload(file, accessToken)
  }, [signer, address])

  return { upload, getAccessToken, uploadWithoutToken }
}
