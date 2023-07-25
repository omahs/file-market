import React from 'react'

import { styled } from '../../../../../styles'
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
})

const BoxShadowedSelect = styled(BoxShadowed, {
  width: 'inherit',
})

interface ISelectBlockchainBlock {
  name: string
  img: string
  onClick: () => void
}

const SelectBlockchainBlock = ({ name, img, onClick }: ISelectBlockchainBlock) => {
  return (
    <BoxShadowedSelect hoverBlue>
      <SelectBlockchainBlockStyle onClick={ () => { onClick() } }>
        <img src={img} />
        <Txt primary1>{name}</Txt>
      </SelectBlockchainBlockStyle>
    </BoxShadowedSelect>
  )
}

export default SelectBlockchainBlock
