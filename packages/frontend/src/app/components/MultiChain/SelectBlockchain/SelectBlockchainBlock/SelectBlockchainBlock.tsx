import { observer } from 'mobx-react-lite'
import React from 'react'

import { styled } from '../../../../../styles'
import { useMediaMui } from '../../../../hooks/useMediaMui'
import BoxShadowed from '../../../../pages/MainPage/components/BoxShadowed/BoxShadowed'
import { Txt } from '../../../../UIkit'

const SelectBlockchainBlockStyle = styled('div', {
  width: '344px',
  height: '120px',
  padding: '16px',
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  cursor: 'pointer',
  '& img': {
    width: '48px',
    height: '48px',
  },
  '&:hover': {
    color: '#0090FF',
  },
  '@md': {
    width: '100%',
  },
})

interface ISelectBlockchainBlock {
  name: string
  img: string
  onClick: () => void
}

const SelectBlockchainBlock = observer(({ name, img, onClick }: ISelectBlockchainBlock) => {
  const { mdValue } = useMediaMui()

  return (
    <BoxShadowed widthInherit={!mdValue} hoverBlue>
      <SelectBlockchainBlockStyle onClick={ () => { onClick() } }>
        <img src={img} />
        <Txt primary1>{name}</Txt>
      </SelectBlockchainBlockStyle>
    </BoxShadowed>
  )
})

export default SelectBlockchainBlock
