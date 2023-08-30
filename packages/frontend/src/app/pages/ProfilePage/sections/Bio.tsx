import React, { useState } from 'react'

import { Txt } from '../../../UIkit'
import { StyledSection, StyledSectionContent, StyledSectionTitle } from '../ProfilePage.styles'

interface IBioProps {
  text?: string
}

const Bio = ({ text }: IBioProps) => {
  const [isShowFullText, setIsShowFullText] = useState<boolean>(false)

  return (
    !!text
      ? (
        <StyledSection style={{ maxWidth: '600px', width: 'inherit' }}>
          <StyledSectionTitle>Bio</StyledSectionTitle>
          <StyledSectionContent>
            <Txt primary1 style={{ fontWeight: 400 }}>
              {
                isShowFullText
                  ? (
                    <>
                      {text}
                      {' '}
                      <Txt primary1 style={{ color: '#6B6F76', cursor: 'pointer' }} onClick={() => { setIsShowFullText(false) }}>Hide</Txt>
                    </>
                  )
                  : (
                    <>
                      {text.substring(0, 200)}
                      {text.length > 200 && '...'}
                      {' '}
                      {text.length > 200 && <Txt primary1 style={{ color: '#6B6F76', cursor: 'pointer' }} onClick={() => { setIsShowFullText(true) }}>Show more</Txt>}
                    </>
                  )
              }
            </Txt>
          </StyledSectionContent>
        </StyledSection>
      )
      : null
  )
}

export default Bio
