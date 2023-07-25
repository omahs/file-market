import React, { useMemo } from 'react'

import { styled } from '../../../../styles'
import { PageLayout, textVariant, Txt } from '../../../UIkit'
import {
  selectBlockchainDescription,
  selectBlockchainTitle,
  selectBlockchainType,
} from '../helper/data/SelectBlockchainData'

const SelectBlockchainStyle = styled(PageLayout, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const SelectBlockchainContent = styled(PageLayout, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '48px',
})

const TextBlock = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

const TitleStyled = styled(Txt, {
  ...textVariant('fourfold1').true,
})

const DescriptionStyled = styled(Txt, {
  ...textVariant('body1').true,
})

interface ISelectBlockchain {
  type?: selectBlockchainType
  title?: string
  description?: string
}

const SelectBlockchain = ({ type, title: titleProps, description: descriptionProps }: ISelectBlockchain) => {
  const title = useMemo(() => {
    if (!type) return titleProps

    return titleProps ?? selectBlockchainTitle[type]
  }, [type, titleProps])

  const description = useMemo(() => {
    if (!type) return descriptionProps

    return descriptionProps ?? selectBlockchainDescription[type]
  }, [type, descriptionProps])

  return (
    <SelectBlockchainStyle>
      <SelectBlockchainContent>
        <TextBlock>
          <TitleStyled>{title}</TitleStyled>
          <DescriptionStyled>{description}</DescriptionStyled>
        </TextBlock>
      </SelectBlockchainContent>
    </SelectBlockchainStyle>
  )
}

export default SelectBlockchain
