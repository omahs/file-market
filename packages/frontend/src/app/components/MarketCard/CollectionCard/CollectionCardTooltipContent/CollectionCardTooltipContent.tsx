import React from 'react'

import { CollectionCardTooltipContentStyled } from './CollectionCardTooltipContent.module'
import CategoriesSection from './section/CategoriesSection'
import FilesSection from './section/FilesSection'

const CollectionCardTooltipContent = () => {
  return (
    <CollectionCardTooltipContentStyled>
      <CategoriesSection categories={['Art', '3D Models', 'Category', 'Music', 'Art', '3D Models', 'Category', 'Music']} />
      <FilesSection files={['Art', '3D Models', 'Category', 'Music', 'Art', '3D Models', 'Category', 'Music']} />
    </CollectionCardTooltipContentStyled>
  )
}

export default CollectionCardTooltipContent
