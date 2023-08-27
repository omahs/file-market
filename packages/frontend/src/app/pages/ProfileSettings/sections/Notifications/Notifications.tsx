import React from 'react'
import { FieldValues } from 'react-hook-form'

import { ControlledInputProps, Input, Txt } from '../../../../UIkit'
import { CheckBox, ControlledCheckBoxProps } from '../../../../UIkit/Form/CheckBox/CheckBox'
import {
  SettingCheckBoxActiveIcon,
  SettingCheckBoxIcon,
} from '../../../../UIkit/Form/CheckBox/variants/SettingCheckBoxIcon'
import {
  CheckBoxContainer,
  FormControlSettings, GrayBgText,
  StyledSectionContent,
  StyledTitleInput,
  StyledTitleSection,
} from '../../ProfileSettings.styles'

interface INotificationsSection<T extends FieldValues> {
  email: ControlledInputProps<T>
  emailNotification: ControlledCheckBoxProps<T>
  // pushNotification: ControlledCheckBoxProps<T>
}

const NotificationsSection = <T extends FieldValues>({ email, emailNotification }: INotificationsSection<T>) => {
  return (
    <StyledSectionContent>
      <StyledTitleSection>Notifications</StyledTitleSection>
      <FormControlSettings>
        <StyledTitleInput>Email</StyledTitleInput>
        <Input<T>
          settings
          placeholder='Email address'
          controlledInputProps={email}
        />
      </FormControlSettings>
      <FormControlSettings>
        <GrayBgText>
          Receive notifications about
          {' '}
          <Txt primary1>starting the deal</Txt>
          {' '}
          and
          {' '}
          <Txt primary1>transferring the keys</Txt>
          {' '}
          of the files
        </GrayBgText>
        <CheckBoxContainer
          control={(
            <CheckBox<T>
              controlledCheckBoxProps={emailNotification}
              icon={<SettingCheckBoxIcon />}
              checkedIcon={<SettingCheckBoxActiveIcon />}
              disableRipple
              sx={{
                padding: 0,
                paddingRight: '12px',
              }}
            />
          )}
          label={<Txt primary1>by email</Txt>}
        />
        {/* <CheckBoxContainer */}
        {/*  control={( */}
        {/*    <CheckBox<T> */}
        {/*      controlledCheckBoxProps={pushNotification} */}
        {/*      icon={<SettingCheckBoxIcon />} */}
        {/*      checkedIcon={<SettingCheckBoxActiveIcon />} */}
        {/*      disableRipple */}
        {/*      sx={{ */}
        {/*        padding: 0, */}
        {/*        paddingRight: '12px', */}
        {/*      }} */}
        {/*    /> */}
        {/*  )} */}
        {/*  label={<Txt primary1>by push notification</Txt>} */}
        {/* /> */}
      </FormControlSettings>
    </StyledSectionContent>
  )
}

export default NotificationsSection
