import React from 'react'
import { FieldValues } from 'react-hook-form'

import { TextStartInput } from '../../../../components/Form/TextStartInput/TextStartInput'
import { ControlledInputProps, Input } from '../../../../UIkit'
import {
  FormControlSettings,
  StyledSectionContent,
  StyledTitleInput,
  StyledTitleSection,
} from '../../ProfileSettings.styles'

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
      <FormControlSettings>
        <StyledTitleInput>Website</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Website URL'
          controlledInputProps={website}
          errorMessage={website.control._formState.errors.website?.message as string}
          isError={!!website.control._formState.errors.website?.message}
        />
      </FormControlSettings>
      <FormControlSettings>
        <StyledTitleInput>X (ex-twitter)</StyledTitleInput>
        <TextStartInput<T>
          inputProps={{
            placeholder: 'X username',
          }}
          controlledInputProps={twitter}
          textStart={'@'}
        />
      </FormControlSettings>
      <FormControlSettings>
        <StyledTitleInput>Telegram</StyledTitleInput>
        <TextStartInput<T>
          inputProps={{
            placeholder: 'Telegram username',
          }}
          controlledInputProps={telegram}
          textStart={'@'}
        />
      </FormControlSettings>
      <FormControlSettings>
        <StyledTitleInput>Discord</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Discord username'
          controlledInputProps={discord}
        />
      </FormControlSettings>
    </StyledSectionContent>
  )
}

export default LinksSection
