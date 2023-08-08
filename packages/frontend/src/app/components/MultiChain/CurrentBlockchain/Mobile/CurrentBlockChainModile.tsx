import { Dropdown } from '@nextui-org/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'

import { styled } from '../../../../../styles'
import { useChangeNetwork } from '../../../../hooks/useChangeNetwork'
import { useCurrentBlockChain } from '../../../../hooks/useCurrentBlockChain'
import { useMultiChainStore } from '../../../../hooks/useMultiChainStore'
import { Txt } from '../../../../UIkit'
import BoxShadowed from '../../../../UIkit/BoxShadowed/BoxShadowed'
import { ICurrentBlockchain } from '../../helper/types/currentBlockChainTypes'
import { CurrentBlockchainStyle } from '../CurrentBlockchain.styles'
import CurrentBlockchainBlock from '../CurrentBlockchainBlock/CurrentBlockchainBlock'

const DropDownWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '13px',
  '[aria-expanded="true"]': {
    opacity: '1 !important',
    transform: 'none !important',
  },
  '[aria-haspopup="true"]': {
    '&:active': {
      transform: 'scale(0.98) !important',
    },
  },
})

const CurrentBlockchainMobile = observer(({ isLight, isVisible }: ICurrentBlockchain) => {
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
    <DropDownWrapper>
      <Txt css={{ fontWeight: 600 }}>Current blockchain:</Txt>
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
          {isVisible && (
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
                  width: '350px',
                  maxWidth: '350px',
                }}
              >
                {multiChainStore.data.map(item => {
                  console.log(item.chain.id.toString())

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
          )
          }
        </Dropdown>
      )}
    </DropDownWrapper>
  )
})

export default CurrentBlockchainMobile
