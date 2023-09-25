import { parseUnits } from 'ethers/lib.esm/utils'
import { useCallback } from 'react'
import { type TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useApi } from '../../hooks/useApi'
import { useCallContract } from '../../hooks/useCallContract'
import { useConfig } from '../../hooks/useConfig'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { type FileMeta } from '../types'
import { assertAccount, assertContract, callContractGetter } from '../utils'
import { useUploadErc721Meta } from './useUploadErc721Meta'

export interface MintNFTForm {
  name?: string // required, hook will return error if omitted
  description?: string
  collectionAddress?: string // required
  image?: File // required
  hiddenFile?: File // required
  license?: string // required
  licenseUrl?: string // required
  categories?: string[] // required
  tags?: string[] // required
  subcategories?: string[]
  royalty?: number
}

type IMintNft = MintNFTForm & {
  isPublicCollection?: boolean
}

interface IUseMintNft {
  collectionAddress?: `0x${string}`
}

interface MintNFTResult {
  tokenId: string
  receipt: TransactionReceipt // вся инфа о транзе
}

export function useMintNFT({ collectionAddress }: IUseMintNft = {}) {
  const { contract } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { wrapPromise, ...statuses } = useStatusState<MintNFTResult, IMintNft>()
  const factory = useHiddenFileProcessorFactory()
  const upload = useUploadErc721Meta()
  const api = useApi()
  const config = useConfig()

  const { callContract } = useCallContract()

  const mintNFT = useCallback(wrapPromise(async (form) => {
    assertContract(contract, config?.collectionToken.name ?? '')
    assertAccount(address)

    const { name, description = '', image, hiddenFile, collectionAddress, license, tags, subcategories, categories, royalty, isPublicCollection } = form
    if (!name || !collectionAddress || !image || !hiddenFile || royalty === undefined) {
      throw Error('CreateCollection form is not filled')
    }

    let tokenIdBN: bigint
    if (isPublicCollection) {
      const { data } = await api.sequencer.acquireDetail(collectionAddress, { wallet: address })
      tokenIdBN = BigInt(data.tokenId ?? 0)
    } else {
      tokenIdBN = await callContractGetter<typeof contract.abi, bigint>({ contract, method: 'tokensCount' })
    }
    const owner = await factory.getOwner(address, collectionAddress, Number(tokenIdBN))

    const hiddenFileEncrypted = await owner.encryptFile(hiddenFile)
    const hiddenFileMeta: FileMeta = {
      name: hiddenFile.name,
      type: hiddenFile.type,
      size: hiddenFile.size,
    }
    const metadata = await upload({
      name,
      description,
      image,
      external_link: mark3dConfig.externalLink,
      hidden_file: hiddenFileEncrypted,
      hidden_file_meta: hiddenFileMeta,
      categories,
      license,
      tags,
      subcategories,
    })
    console.log('mint metadata', metadata)

    const receipt = await callContract({ contract, method: 'mint' },
      address,
      tokenIdBN,
      metadata.url,
      parseUnits(royalty.toString(), 2),
      '0x00',
    )

    console.log(receipt)

    return {
      tokenId: tokenIdBN.toString(),
      receipt,
    }
  }), [contract, address, factory, wrapPromise])

  return { ...statuses, mintNFT }
}
