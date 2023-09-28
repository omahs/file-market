import { JsonRpcError, serializeError } from '@metamask/rpc-errors'
import { getWalletClient } from '@wagmi/core'
import { type AbiFunction } from 'abitype/src/abi'
import assert from 'assert'
import { type Abi } from 'viem'
import { type GetContractResult } from 'wagmi/dist/actions'

import { wagmiConfig } from '../../config/web3Modal'
import { rootStore } from '../../stores/RootStore'

const FIVE_MINUTES = 300_000
const fallbackError = { code: 500, message: 'unknown' }

export enum ProviderErrorMessages {
  InternalError = 'Internal JSON-RPC error.',
  InsufficientBalance = 'Actor balance less than needed.',
}

export enum ErrorMessages {
  InsufficientBalance = 'Balance too low for transaction.',
  RejectedByUser = 'Transaction rejected by user.',
}

export const stringifyContractError = (error: any) => {
  if (error?.code === 'ACTION_REJECTED') {
    return ErrorMessages.RejectedByUser
  }

  let message = 'Unknown'
  const serializedError = serializeError(error, { fallbackError })
  const { data }: any = serializedError
  if (serializedError.code === 500) {
    if (data?.cause?.error?.data?.message) {
      const rawMessage: string = data.cause.error.data.message
      // vm error is truncated and useless for us
      message = rawMessage.split(', vm error:')[0]
    } else if (data?.cause?.reason) {
      message = data.cause.reason
    } else if (data?.cause?.message) {
      message = data.cause.message
    }
  } else if (serializedError.message === ProviderErrorMessages.InternalError) {
    if (data.message?.includes(ProviderErrorMessages.InsufficientBalance)) {
      message = ErrorMessages.InsufficientBalance
    } else {
      message = data.message
    }
  } else {
    message = `Transaction failed. Reason: ${serializedError.message}`
  }

  return `${message} Please try again.`
}

export const callContractGetter = async <T extends Abi, R = any>({
  contract,
  method,
}: {
  contract: GetContractResult<T>
  method: Extract<GetContractResult<T>['abi'][number], AbiFunction>['name']
},
  ...args: any[]
): Promise<R> => {
  try {
    const client = wagmiConfig.getPublicClient()

    const walletClient = await getWalletClient()

    const chainId = await client?.getChainId()

    const chain = rootStore.multiChainStore.getChainById(chainId)?.chain

    console.log(chain)

    assert(walletClient)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const data = (await client?.readContract({
      address: contract.address,
      functionName: method,
      abi: contract.abi,
      args,
    })) as R

    console.log('CONTRACT GETTER')
    console.log(data)

    return data
  } catch (error: any) {
    console.error(error)

    throw new Error(stringifyContractError(error))
  }
}
export const wait = (miliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(() => { resolve() }, miliseconds)
})

const pingTx = async (txHash: `0x${string}`) => {
  let receipt = null
  const start = Date.now()

  while (receipt === null) {
    if (Date.now() - start > FIVE_MINUTES) break
    await wait(1000)

    receipt = await wagmiConfig.getPublicClient().getTransactionReceipt({ hash: txHash })

    if (receipt === null) continue
  }

  return receipt
}

export const getTxReceipt = async (hash: `0x${string}`) => {
  const client = wagmiConfig.getPublicClient()

  console.log(hash)

  const receipt = await Promise.race([
    await client?.waitForTransactionReceipt({
      hash,
    }),
    pingTx(hash),
  ])

  if (!receipt?.status) {
    throw new JsonRpcError(503, `The transaction ${hash} is failed`)
  }

  return receipt
}
