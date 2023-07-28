
import { observer } from 'mobx-react-lite'
import React from 'react'

import { useMediaMui } from '../../../hooks/useMediaMui'
import { ICurrentBlockchain } from '../helper/types/currentBlockChainTypes'
import CurrentBlockchainBigScreen from './BigScreen/CurrentBlockchainBigScreen'
import CurrentBlockchainMobile from './Mobile/CurrentBlockChainModile'

const CurrentBlockchain = observer((props: ICurrentBlockchain) => {
  const { mdValue } = useMediaMui()

  return (
    <>
      {mdValue ? <CurrentBlockchainMobile {...props} /> : <CurrentBlockchainBigScreen {...props} />}
    </>
  )
})

export default CurrentBlockchain
