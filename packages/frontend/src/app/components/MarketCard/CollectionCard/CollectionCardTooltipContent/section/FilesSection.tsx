import React from 'react'

import { styled } from '../../../../../../styles'
import {
  CollectionCardBaseTag,
  CollectionCardSection,
  CollectionCardSectionContent,
  CollectionCardSectionHeader,
} from '../CollectionCardTooltipContent.styles'

const FilesCard = styled(CollectionCardBaseTag, {
  borderRadius: '4px',
})

const FilesSection = ({ files }: { files?: string[] }) => {
  return (
    <CollectionCardSection>
      <CollectionCardSectionHeader>
        Files types
      </CollectionCardSectionHeader>
      <CollectionCardSectionContent>
        {files?.map((item, index) => {
          return <FilesCard key={index}>{item}</FilesCard>
        })}
      </CollectionCardSectionContent>
    </CollectionCardSection>
  )
}

export default FilesSection
