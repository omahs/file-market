import React from 'react'
import { FieldValues } from 'react-hook-form'

import { ControlledInputProps, FormControl, Input } from '../../../../UIkit'
import { StyledSectionContent, StyledTitleInput, StyledTitleSection } from '../../ProfileSettings.styles'

interface INotificationsSection<T extends FieldValues> {
  email: ControlledInputProps<T>
}

const NotificationsSection = <T extends FieldValues>({ email }: INotificationsSection<T>) => {
  return (
    <StyledSectionContent>
      <StyledTitleSection>Notifications</StyledTitleSection>
      <FormControl>
        <StyledTitleInput>Email</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Email address'
          controlledInputProps={email}
        />
      </FormControl>
    </StyledSectionContent>
  )
}

export default NotificationsSection
