import React, { useMemo } from 'react'

import LinkCard from '../components/LinksCard/LinkCard'
import { type typesCard } from '../helper/linkCard/types'
import { StyledSection, StyledSectionContent, StyledSectionTitle } from '../ProfilePage.styles'

interface ILinksProps {
  items: Record<typesCard, string | undefined>
}

const Links = (props: ILinksProps) => {
  const { items } = props

  const isContainLink = useMemo(() => {
    for (const value of Object.values(items)) {
      if (value) return true
    }

    return false
  }, [items])

  return (
    isContainLink
      ? (
        <StyledSection>
          <StyledSectionTitle>Links</StyledSectionTitle>
          <StyledSectionContent>
            {Object.keys(items).map(item => {
              const text = items[item as keyof ILinksProps['items']]
              if (!text) return null

              return <LinkCard key={item} text={text} type={item as keyof ILinksProps['items']} />
            })}
          </StyledSectionContent>
        </StyledSection>
      )
      : null
  )
}

export default Links
