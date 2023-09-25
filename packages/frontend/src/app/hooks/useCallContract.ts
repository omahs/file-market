import { JsonRpcError } from '@metamask/rpc-errors'
import { getWalletClient } from '@wagmi/core'
import { type AbiFunction } from 'abitype/src/abi'
import assert from 'assert'
import { type Abi, type PublicClient } from 'viem'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { type GetContractResult } from 'wagmi/actions'

import { wagmiConfig } from '../config/web3Modal'
import { ErrorMessages, getTxReceipt, stringifyContractError } from '../processing'

interface ICallContract<T extends Abi> {
  contract: GetContractResult<T>
  method: Extract<GetContractResult<T>['abi'][number], AbiFunction>['name']
  publicClient?: PublicClient
  ignoreTxFailture?: boolean
  minBalance?: bigint
  params?: { gasPrice?: bigint, value?: bigint }
}

export const useCallContract = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data } = useBalance({
    address,
  })
  const callContract = async <T extends Abi> ({
    contract,
    method,
    ignoreTxFailture,
    minBalance,
    params,
  }: ICallContract<T>, ...args: any[]
  ) => {
    try {
      const client = wagmiConfig.getPublicClient()

      const walletClient = await getWalletClient()

      assert(walletClient)

      if (data && minBalance) {
        // equality anyway throws an error because of gas
        if (data.value === 0n || minBalance >== data.value) {
          throw new JsonRpcError(402, ErrorMessages.InsufficientBalance)
        }
      }

      console.log(contract)
      console.log(address)
      console.log(method)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const { request } = await client?.simulateContract({
        account: address,
        functionName: method,
        abi: contract.abi,
        address: contract.address,
        chain,
        args,
        ...params,
      })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const hash = await walletClient?.writeContract(request)

      if (ignoreTxFailture) {
        return await client?.waitForTransactionReceipt({
          hash,
        })
      }

      return await getTxReceipt(hash)
    } catch (error: any) {
      console.error(error)

      throw new Error(stringifyContractError(error))
    }
  }

  return {
    callContract,
  }
}
