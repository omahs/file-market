import assert from 'assert'
import { randomBytes } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { wagmiConfig } from '../../config/web3Modal'
import { useStatusState } from '../../hooks'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useAccessTokenContract } from '../contracts'
import { Mark3dAccessTokenEventNames } from '../types'
import { assertAccount, assertContract } from '../utils/assert'
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
  const { contract } = useAccessTokenContract()
  const { wrapPromise, ...statuses } = useStatusState<CreateCollectionResult, CreateCollectionForm>()
  const upload = useUploadErc721Meta()
  const config = useConfig()
  const mintCollection = useCallback(wrapPromise(async (form: CreateCollectionForm) => {
    const { name, symbol, image, description } = form
    assertContract(contract, config?.accessToken.name ?? '')
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

    const salt = `0x${Buffer.from(randomBytes(32)).toString('hex')}` as const
    const receipt = await callContract(
      { contract, method: 'createCollection', ignoreTxFailture: true },
      salt,
      name,
      symbol,
      metadata.url,
      metadata.url,
      address,
      '0x00',
    )

    const createCollectionEvent = await wagmiConfig.getPublicClient().getContractEvents({
      ...contract,
      eventName: 'CollectionCreation',
    })

    console.log('event')
    console.log(createCollectionEvent)

    console.log(receipt.logs)

    if (!createCollectionEvent) {
      throw Error(`receipt does not contain ${Mark3dAccessTokenEventNames.CollectionCreation} event`)
    }

    const collectionAddressArgIndex = 1
    // const getArg = (index: number): any => {
    //   const arg = createCollectionEvent.args?.[index]
    //   assert(arg, `${Mark3dAccessTokenEventNames.CollectionCreation} does not have an arg with index ${index}`)
    //
    //   return arg
    // }

    return { collectionAddress: '' }
  }), [contract, wrapPromise, upload])

  return { ...statuses, mintCollection }
}
