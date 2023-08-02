import React from 'react'
import { FieldValues } from 'react-hook-form'

import { ControlledInputProps, FormControl, Input } from '../../../../UIkit'
import { StyledSectionContent, StyledTitleInput, StyledTitleSection } from '../../ProfileSettings.styles'

interface ILinksSection<T extends FieldValues> {
  website: ControlledInputProps<T>
  twitter: ControlledInputProps<T>
  telegram: ControlledInputProps<T>
  discord: ControlledInputProps<T>
}

const LinksSection = <T extends FieldValues>({ website, telegram, discord, twitter }: ILinksSection<T>) => {
  return (
    <StyledSectionContent>
      <StyledTitleSection>Links</StyledTitleSection>
      <FormControl>
        <StyledTitleInput>Website</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Website URL'
          controlledInputProps={website}
        />
      </FormControl>
      <FormControl>
        <StyledTitleInput>X (ex-twitter)</StyledTitleInput>
        <Input<T>
          settings
          placeholder='X username'
          controlledInputProps={twitter}
        />
      </FormControl>
      <FormControl>
        <StyledTitleInput>Telegram</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Telegram username'
          controlledInputProps={telegram}
        />
      </FormControl>
      <FormControl>
        <StyledTitleInput>Discord</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Discrod username'
          controlledInputProps={discord}
        />
      </FormControl>
    </StyledSectionContent>
  )
}

export default LinksSection
