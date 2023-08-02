import React from 'react'
import { FieldValues } from 'react-hook-form'

import { ControlledInputProps, FormControl, Input } from '../../../../UIkit'
import { StyledSectionContent, StyledTitleInput, StyledTitleSection } from '../../ProfileSettings.styles'

interface IAppearanceSection<T extends FieldValues> {
  name: ControlledInputProps<T>
  url: ControlledInputProps<T>
  bio: ControlledInputProps<T>
}

const AppearanceSection = <T extends FieldValues>({ name, url, bio }: IAppearanceSection<T>) => {
  return (
    <StyledSectionContent>
      <StyledTitleSection>Appearance</StyledTitleSection>
      <FormControl>
        <StyledTitleInput>Display name</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Profile name'
          controlledInputProps={name}
        />
      </FormControl>
      <FormControl>
        <StyledTitleInput>URL</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Short URL'
          controlledInputProps={url}
        />
      </FormControl>
      <FormControl>
        <StyledTitleInput>Bio</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Types something about you. For example, do you like Capybaras?, do you like Wednesday song?'
          controlledInputProps={bio}
        />
      </FormControl>
    </StyledSectionContent>
  )
}

export default AppearanceSection
