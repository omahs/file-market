import React from 'react'

import { CollectionCardTooltipContentStyled } from './CollectionCardTooltipContent.styles'
import CategoriesSection from './section/CategoriesSection'
import FilesSection from './section/FilesSection'

interface ICollectionCardTooltipContent {
  categories?: string[]
  files?: string[]
}

const CollectionCardTooltipContent = ({ categories, files }: ICollectionCardTooltipContent) => {
  return (
    <CollectionCardTooltipContentStyled>
      <CategoriesSection categories={categories} />
      <FilesSection files={files} />
    </CollectionCardTooltipContentStyled>
  )
}

export default CollectionCardTooltipContent
