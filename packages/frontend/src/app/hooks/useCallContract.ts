import { GetContractResult } from 'wagmi/actions'
import { createPublicClient, createWalletClient, custom, http, PublicClient } from 'viem'
import { mainnet, useAccount, useBalance } from 'wagmi'
import { JsonRpcError } from '@metamask/rpc-errors'
import { ContractTransaction } from 'ethers'
import { ErrorMessages, getTxReceipt, stringifyContractError } from '../processing'
import { getWalletClient } from '@wagmi/core'
import { wagmiConfig } from '../config/web3Modal'
import assert from 'assert'

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

      if (data && minBalance) {
        // equality anyway throws an error because of gas
        if (data.value == 0n || minBalance >= data.value) {
          throw new JsonRpcError(402, ErrorMessages.InsufficientBalance)
        }
      }

      const { request } = await client?.simulateContract({
        account: address,
        functionName: method,
        abi: contract.abi,
        address: contract.address
      })

      const hash = await walletClient?.writeContract(request)

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

  return {
    callContract
  }
}