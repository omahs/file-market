import React, { useMemo, useState } from 'react'

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

const CategoriesSection = ({ categories, isCollectionPage }: { categories?: string[], isCollectionPage?: boolean }) => {
  const [isFullView, setIsFullView] = useState<boolean>(false)

  const categoriesCardsCountRender = useMemo(() => {
    return isFullView ? categories?.length : 4
  }, [isFullView])

  return (
    <CollectionCardSection>
      <CollectionCardSectionHeader isCollectionPage>
        Categories
      </CollectionCardSectionHeader>
      <CollectionCardSectionContent isCollectionPage>
        {categories?.map((item, index) => {
          return <CategoriesCard key={index} isCollectionPage>{item}</CategoriesCard>
        })}
      </CollectionCardSectionContent>
    </CollectionCardSection>
  )
}

export default CategoriesSection
