import { GetContractResult } from 'wagmi/actions'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet, useAccount, useBalance } from 'wagmi'
import { JsonRpcError } from '@metamask/rpc-errors'
import { ContractTransaction } from 'ethers'
import { ErrorMessages, getTxReceipt, stringifyContractError } from '../processing'

export const useCallContract = () => {
  const { address } = useAccount()
  const { data } = useBalance({
    address
  })
  const callContract = async ({
  contract,
  method,
  ignoreTxFailture,
  minBalance,
  publicClient,
  address
  }: {
    contract: GetContractResult
    method: keyof GetContractResult
    publicClient?: PublicClient
    address?: `0x${string}`
    ignoreTxFailture?: boolean
    minBalance?: bigint
  }, ...args: any[]
  ) => {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http()
      })
      if (data && minBalance) {
        // equality anyway throws an error because of gas
        if (data.value == 0n || minBalance >= data.value) {
          throw new JsonRpcError(402, ErrorMessages.InsufficientBalance)
        }
      }

      await contract.callStatic[method](...args)
      const tx: ContractTransaction = await contract[method](...args)

      if (ignoreTxFailture) {
        return await tx.wait()
      }

      return await getTxReceipt(tx)
    } catch (error: any) {
      console.error(error)

      throw new Error(stringifyContractError(error))
    }
  }

  return {
    callContract
  }
}