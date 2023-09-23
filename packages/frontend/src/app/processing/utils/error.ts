import { JsonRpcError, serializeError } from '@metamask/rpc-errors'
import { Contract, ContractTransaction } from 'ethers'
import { PublicClient, http, createPublicClient, createWalletClient } from 'viem'
import { mainnet } from 'wagmi'
import { GetContractResult } from 'wagmi/dist/actions'

import { wagmiConfig } from '../../config/web3Modal'
import { WriteContractParameters } from 'viem/actions/wallet/writeContract'
import { getWalletClient } from '@wagmi/core'
import assert from 'assert'

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

export const callContractGetter = async <R = any>({
                                                    contract,
                                                    method
                                                  }: {
                                                    contract: Contract
                                                    method: keyof Contract
                                                  },
                                                  ...args: any[]
): Promise<R> => {
  try {
    await contract.callStatic[method](...args)

    return contract[method](...args)
  } catch (error: any) {
    console.error(error)

    throw new Error(stringifyContractError(error))
  }
}

export const callContract = async ({
                                     contract,
                                     method,
                                     ignoreTxFailture,
                                     minBalance
                                   }: {
                                     contract: GetContractResult
                                     method: keyof GetContractResult
                                     publicClient?: PublicClient
                                     ignoreTxFailture?: boolean
                                     minBalance?: bigint
                                   }, ...args: any[]
) => {
  try {
    const client = wagmiConfig.getPublicClient()

    const walletClient = await getWalletClient()

    assert(walletClient)

    const address = await walletClient.getAddresses()

    const value = await client.getBalance({
      address: address[0]
    })

    if (minBalance) {
      // equality anyway throws an error because of gas
      if (value == 0n || minBalance >= value) {
        throw new JsonRpcError(402, ErrorMessages.InsufficientBalance)
      }
    }

    const { request } = await client?.simulateContract({
      account: address[0],
      functionName: method,
      abi: contract.abi,
      address: contract.address
    })

    const hash = await walletClient.writeContract(request)

    if (ignoreTxFailture) {
      return await client?.waitForTransactionReceipt({
        hash: hash
      })
    }

    return await getTxReceipt(hash)
  } catch (error: any) {
    console.error(error)

    throw new Error(stringifyContractError(error))
  }
}

export const wait = (miliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(() => resolve(), miliseconds)
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

  const receipt = await Promise.race([
    await client?.waitForTransactionReceipt({
      hash
    }),
    pingTx(hash)
  ])

  if (!receipt || !receipt.status) {
    throw new JsonRpcError(503, `The transaction ${hash} is failed`)
  }

  return receipt
}
