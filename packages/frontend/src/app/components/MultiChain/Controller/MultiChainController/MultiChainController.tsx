import React, { ReactNode, useState } from 'react'

import SelectBlockchain from '../../SelectBlockchain/SelectBlockchain'

interface IMultiChainController {
  renderElem: ReactNode
}

const MultiChainController = ({ renderElem }: IMultiChainController) => {
  const [isChoosen, setIsChoosen] = useState<boolean>(false)

  return (
    <>
      {isChoosen ? renderElem : <SelectBlockchain on />}
    </>
  )
}

export default MultiChainController
