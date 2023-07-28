import React, { ReactNode, useState } from 'react'

import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import { selectBlockchainType } from '../../helper/data/SelectBlockchainData'
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
