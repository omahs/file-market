import React, { useState } from 'react'
import { type FieldValues } from 'react-hook-form'

import { TextStartInput } from '../../../../components/Form/TextStartInput/TextStartInput'
import { type ControlledInputProps, Input } from '../../../../UIkit'
import { TextArea } from '../../../../UIkit/Form/TextArea/TextArea'
import {
  FormControlSettings,
  LabelWithCounter,
  LetterCounter,
  StyledSectionContent,
  StyledTitleInput,
  StyledTitleSection,
} from '../../ProfileSettings.styles'

interface IAppearanceSection<T extends FieldValues> {
  name: ControlledInputProps<T>
  url: ControlledInputProps<T>
  bio: ControlledInputProps<T>
}

const AppearanceSection = <T extends FieldValues>({ name, url, bio }: IAppearanceSection<T>) => {
  const [bioLength, setBioLength] = useState<number>(bio.control._defaultValues.bio?.length ?? 0)

  return (
    <StyledSectionContent>
      <StyledTitleSection>Appearance</StyledTitleSection>
      <FormControlSettings>
        <StyledTitleInput>Display name</StyledTitleInput>
        <Input<T>
          errorMessage={name.error ?? name.control._formState.errors.name?.message as string}
          isError={!!(name.error ?? name.control._formState.errors.name?.message)}
          settings
          placeholder='Profile name'
          controlledInputProps={name}
        />
      </FormControlSettings>
      <FormControlSettings>
        <StyledTitleInput>URL</StyledTitleInput>
        <TextStartInput<T>
          inputProps={{
            placeholder: 'URL',
            errorMessage: url.error ?? url.control._formState.errors.username?.message as string,
            isError: !!(url.error ?? url.control._formState.errors.username?.message),
            settings: true,
          }}
          controlledInputProps={url}
          textStart={'filemarket.xyz/profile/'}
        />
      </FormControlSettings>
      <FormControlSettings>
        <LabelWithCounter>
          <StyledTitleInput>
            Bio
          </StyledTitleInput>
          <LetterCounter isError={bioLength > 1000}>
            {bioLength}
            /1000
          </LetterCounter>
        </LabelWithCounter>
        <TextArea<T>
          settings
          placeholder='Types something about you. For example, do you like Capybaras?, do you like Wednesday song?'
          controlledInputProps={{
            ...bio,
          }}
          style={{
            height: '96px',
          }}
          {
            ...bio.control.register(bio.name, {
              onChange(event) {
                setBioLength(event?.target?.value?.length ?? 0)
              },
              maxLength: 1000,
            })
          }
          isError={bioLength > 1000}
        />
      </FormControlSettings>
    </StyledSectionContent>
  )
}

export default AppearanceSection
