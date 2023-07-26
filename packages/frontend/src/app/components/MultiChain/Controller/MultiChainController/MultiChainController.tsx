import React, { ReactNode, useState } from 'react'

import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import SelectBlockchain from '../../SelectBlockchain/SelectBlockchain'

interface IMultiChainController {
  renderElem: ReactNode
}

const MultiChainController = ({ renderElem }: IMultiChainController) => {
  const [isChoosen, setIsChoosen] = useState<boolean>(false)
  const { changeNetwork, chain } = useChangeNetwork({
    onSuccess: () => {
      setIsChoosen(true)
    },
  })

  return (
    <>
      {isChoosen ? renderElem : (
        <SelectBlockchain onChange={(chainId) => {
          if (chain?.id === chainId) setIsChoosen(true)
          else changeNetwork(chainId)
        }}
        />
      )}
    </>
  )
}

export default MultiChainController
