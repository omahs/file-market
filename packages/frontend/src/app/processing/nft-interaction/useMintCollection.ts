import assert from 'assert'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { wagmiConfig } from '../../config/web3Modal'
import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { Mark3dAccessTokenEventNames } from '../types'
import { assertAccount, assertConfig } from '../utils/assert'
import { useUploadErc721Meta } from './useUploadErc721Meta'

export interface CreateCollectionForm {
  name?: string // required, hook will return error if omitted
  symbol?: string // required
  description?: string
  image?: File // required
}

interface CreateCollectionResult {
  collectionAddress: string
}

export function useMintCollection() {
  const { address } = useAccount()
  const { wrapPromise, ...statuses } = useStatusState<CreateCollectionResult, CreateCollectionForm>()
  const upload = useUploadErc721Meta()
  const config = useConfig()
  const mintCollection = useCallback(wrapPromise(async (form: CreateCollectionForm) => {
    const { name, symbol, image, description } = form
    assertConfig(config)
    assertAccount(address)
    assert(name && symbol && image, 'CreateCollection form is not filled')

    const metadata = await upload({
      name,
      description: description ?? '',
      image,
      external_link: mark3dConfig.externalLink,
    })
    console.log('mint metadata', metadata)

    const { callContract } = useCallContract()

    const hex = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    const salt = `0x${hex}` as const
    const receipt = await callContract(
      {
        callContractConfig: {
          address: config.accessToken.address,
          abi: config.accessToken.abi,
          functionName: 'createCollection',
          args: [salt,
            name,
            symbol,
            metadata.url,
            metadata.url,
            address,
            '0x00'],
        },
        ignoreTxFailture: true,
      })

    const createCollectionEvent = await wagmiConfig.getPublicClient().getContractEvents({
      address: config.accessToken.address,
      abi: config.accessToken.abi,
      eventName: 'CollectionCreation',
    })

    console.log('event')
    console.log(createCollectionEvent)

    console.log(receipt.logs)

    if (!createCollectionEvent) {
      throw Error(`receipt does not contain ${Mark3dAccessTokenEventNames.CollectionCreation} event`)
    }

    return { collectionAddress: '' }
  }), [config, wrapPromise, upload])

  return { ...statuses, mintCollection }
}
