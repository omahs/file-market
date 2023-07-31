
import { observer } from 'mobx-react-lite'
import React from 'react'

import { useMediaMui } from '../../../hooks/useMediaMui'
import { ICurrentBlockchain } from '../helper/types/currentBlockChainTypes'
import CurrentBlockchainBigScreen from './BigScreen/CurrentBlockchainBigScreen'
import { CurrentBlockchainContainer } from './CurrentBlockchain.styles'
import CurrentBlockchainMobile from './Mobile/CurrentBlockChainModile'

const CurrentBlockchain = observer((props: ICurrentBlockchain) => {
  const { mdValue } = useMediaMui()

  return (
    <>
      {
        props.isVisible && (
          <CurrentBlockchainContainer isBorderDisabled={props.isLight}>
            {mdValue ? <CurrentBlockchainMobile {...props} /> : <CurrentBlockchainBigScreen {...props} />}
          </CurrentBlockchainContainer>
        )
      }
    </>
  )
})

export default CurrentBlockchain
