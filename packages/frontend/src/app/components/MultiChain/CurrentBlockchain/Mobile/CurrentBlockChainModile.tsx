import { Dropdown } from '@nextui-org/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'

import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import { useCurrentBlockChain } from '../../../../hooks/useCurrentBlockChain'
import { useMultiChainStore } from '../../../../hooks/useMultiChainStore'
import BoxShadowed from '../../../../pages/MainPage/components/BoxShadowed/BoxShadowed'
import { Txt } from '../../../../UIkit'
import { ICurrentBlockchain } from '../../helper/types/currentBlockChainTypes'
import { CurrentBlockchainStyle } from '../CurrentBlockchain.styles'
import CurrentBlockchainBlock from '../CurrentBlockchainBlock/CurrentBlockchainBlock'

const CurrentBlockchainMobile = observer(({ isLight }: ICurrentBlockchain) => {
  const multiChainStore = useMultiChainStore()
  const currentChainStore = useCurrentBlockChain()
  const { changeNetwork, isLoading, error } = useChangeNetwork({
    onError: () => {
      setSelected(new Set([currentChainStore.chainId?.toString()]))
    },
  })
  const [selected, setSelected] = React.useState(new Set([currentChainStore.chainId?.toString()]))

  const selectedValue = React.useCallback((value: any): string => {
    return Array.from(value).join(', ')
  }, [selected])

  useEffect(() => {
    setSelected(new Set([currentChainStore.chainId?.toString()]))
  }, [currentChainStore.chainId])

  return (
    <>
      {multiChainStore.data && (
        <Dropdown
          isDisabled={isLoading && !error}
          placement={'bottom'}
          borderWeight={'black'}
        >
          {
          // @ts-expect-error
            <Dropdown.Trigger style={{ width: 'max-content' }}>
              <CurrentBlockchainStyle isLight={isLight} style={{ width: 'max-content ' }}>
                <Txt>Current blockchain:</Txt>
                <CurrentBlockchainBlock
                  name={multiChainStore.getChainById(+selectedValue(selected))?.chain.name ?? ''}
                  img={multiChainStore.getChainById(+selectedValue(selected))?.img ?? ''}
                  isHasTick
                  isLight={isLight}
                  isActive
                />
              </CurrentBlockchainStyle>
            </Dropdown.Trigger>
          }
          {
            <BoxShadowed>
              <Dropdown.Menu
                aria-label='Single selection actions'
                disallowEmptySelection
                selectionMode='single'
                // @ts-expect-error
                selectedKeys={selected}
                onSelectionChange={(keys) => {
                // @ts-expect-error
                  setSelected(keys)
                  changeNetwork(+selectedValue(keys))
                }}
                css={{
                  borderRadius: '16px',
                  background: 'rgba(249, 249, 249, 0.95)',
                  boxShadow: '10px 10px 0px 0px rgba(114, 114, 114, 0.50)',
                  width: '338px',
                  maxWidth: '338px',
                }}
              >
                {multiChainStore.data.map(item => {
                  return (
                    <Dropdown.Item
                      key={item.chain.id.toString()}
                      css={{
                        '& img': {
                          width: '24px',
                          height: '24px',
                        },
                        padding: '12px',
                        height: 'max-content',
                        '& .nextui-dropdown-item-content': {
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                        },
                      }}
                    >
                      <img src={item.img} />
                      <Txt
                        primary1
                        style={{
                          color: '#2F3134',
                        }}
                      >
                        {item.chain.name}
                      </Txt>
                    </Dropdown.Item>
                  )
                })}
              </Dropdown.Menu>
            </BoxShadowed>
          }
        </Dropdown>
      )}
    </>
  )
})

export default CurrentBlockchainMobile
