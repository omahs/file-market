import { ComponentProps } from '@stitches/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'

import { styled } from '../../../../styles'
import { useChangeNetwork } from '../../../hooks/useChangeNetwork'
import { useCurrentBlockChain } from '../../../hooks/useCurrentBlockChain'
import { useMultiChainStore } from '../../../hooks/useMultiChainStore'
import { Txt } from '../../../UIkit'
import CurrentBlockchainBlock from './CurrentBlockchainBlock/CurrentBlockchainBlock'

const CurrentBlockchainStyle = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  background: 'none',
  height: '56px',
  variants: {
    isLight: {
      true: {
        color: 'white',
      },
    },
  },
})

const LinearText = styled(Txt, {
  background: 'linear-gradient(135deg, #028FFF 0%, #04E762 100%)',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
})

type ICurrentBlockchain = ComponentProps<typeof CurrentBlockchainStyle> & {
  isVisible?: boolean
}
const CurrentBlockchain = observer(({ isVisible, isLight }: ICurrentBlockchain) => {
  const multiChainStore = useMultiChainStore()
  const currentChainStore = useCurrentBlockChain()
  const { changeNetwork, isLoading, error } = useChangeNetwork()

  useEffect(() => {
    console.log(isLoading)
    console.log(error)
  }, [isLoading, error])

  return (
    <>
      {isVisible && (
        <CurrentBlockchainStyle isLight={isLight}>
          <Txt>Current blockchain:</Txt>
          <>
            {multiChainStore.data?.map(item => {
              return (
                <CurrentBlockchainBlock
                  key={item.chain.id.toString()}
                  isLight={isLight}
                  isActive={currentChainStore.chainId === item.chain.id}
                  name={item.chain.name}
                  img={item.img}
                  isDisable={isLoading && !error}
                  onClick={() => {
                    changeNetwork(item.chain.id)
                  }}
                />
              )
            })}
          </>
          <LinearText>
            Ethereum will be available coming soon!
          </LinearText>
        </CurrentBlockchainStyle>
      )}
    </>
  )
})

export default CurrentBlockchain
