import React from 'react'

import { styled } from '../../../../../../styles'
import {
  CollectionCardBaseTag,
  CollectionCardSection,
  CollectionCardSectionContent,
  CollectionCardSectionHeader,
} from '../CollectionCardTooltipContent.styles'

const CategoriesCard = styled(CollectionCardBaseTag, {
  borderRadius: '12px',
})

const CategoriesSection = ({ categories }: { categories: string[] }) => {
  return (
    <CollectionCardSection>
      <CollectionCardSectionHeader>
        Categories
      </CollectionCardSectionHeader>
      <CollectionCardSectionContent>
        {categories.map((item, index) => {
          return <CategoriesCard key={index}>{item}</CategoriesCard>
        })}
      </CollectionCardSectionContent>
    </CollectionCardSection>
  )
}

export default CategoriesSection
