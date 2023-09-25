import React, { type ReactNode, useEffect, useState } from 'react'

import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import { type selectBlockchainType } from '../../helper/data/SelectBlockchainData'
import SelectBlockchain from '../../SelectBlockchain/SelectBlockchain'

interface IMultiChainController {
  renderElem: ReactNode
  type: selectBlockchainType
}

const MultiChainController = ({ renderElem, type }: IMultiChainController) => {
  const [isChoosen, setIsChoosen] = useState<boolean>(false)
  const { changeNetwork, chain } = useChangeNetwork({
    onSuccess: () => {
      setIsChoosen(true)
    },
  })

  useEffect(() => {
    if (isChoosen) {
      setIsChoosen((prev) => !prev)
      setTimeout(() => {
        setIsChoosen((prev) => !prev)
      }, 0)
    }
  }, [chain])

  return (
    <>
      {isChoosen ? renderElem : (
        <SelectBlockchain
          type={type}
          onChange={(chainId) => {
            if (chain?.id === chainId) setIsChoosen(true)
            else changeNetwork(chainId)
          }}
        />
      )}
    </>
  )
}

export default MultiChainController
