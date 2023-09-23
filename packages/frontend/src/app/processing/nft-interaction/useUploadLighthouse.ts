import lighthouse from '@lighthouse-web3/sdk'
import { Signer } from 'ethers'
import { useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'

import { lighthouseService } from '../../services/LighthouseService'
import { assertAccount, assertSigner } from '../utils/assert'
import { WalletClient } from 'viem'

export function useUploadLighthouse() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const getAccessToken = async (address: `0x${string}`, walletClient: WalletClient) => {
    const message = await lighthouseService.getMessage(address)
    const signedMessage = await walletClient.signMessage({
      account: address,
      message: message
    }) // Sign message

    return lighthouseService.getAccessToken(address, signedMessage)
  }

  const upload = useCallback(async (file: File | Blob, accessToken: string) => {
    assertSigner(walletClient)
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
  }, [walletClient, address])

  const uploadWithoutToken = useCallback(async (file: File | Blob) => {
    assertSigner(walletClient)
    assertAccount(address)
    const accessToken = await getAccessToken(address, walletClient)

    return upload(file, accessToken)
  }, [walletClient, address])

  return { upload, getAccessToken, uploadWithoutToken }
}
