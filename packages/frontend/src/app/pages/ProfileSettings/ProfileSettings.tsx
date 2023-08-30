import { observer } from 'mobx-react-lite'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { BaseModal } from '../../components'
import { useStores } from '../../hooks'
import { useStatusModal } from '../../hooks/useStatusModal'
import { Button, PageLayout, Txt } from '../../UIkit'
import ReturnButton from './components/ReturnButton/ReturnButton'
import { useUpdateProfile } from './helper/hooks/useUpdateProfile'
import { IProfileSettings } from './helper/types/formType'
import { Form, GrayBgText, StyledTitle } from './ProfileSettings.styles'
import AppearanceSection from './sections/Appereance/Appereance'
import Links from './sections/Links/Links'
import Notifications from './sections/Notifications/Notifications'

export default observer(function ProfileSettings() {
  const { userStore } = useStores()

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<IProfileSettings>({
    mode: 'onBlur',
    defaultValues: {
      name: userStore.user?.name,
      username: userStore.user?.username,
      bio: userStore.user?.bio,
      email: userStore.user?.email,
      websiteUrl: userStore.user?.websiteUrl,
      twitter: userStore.user?.twitter,
      telegram: userStore.user?.telegram,
      isEmailNotificationEnabled: userStore.user?.isEmailNotificationEnabled,
    },
  })

  const {
    statuses,
    updateProfile,
  } = useUpdateProfile()
  const { address } = useAccount()
  const onSubmit: SubmitHandler<IProfileSettings> = (data) => {
    updateProfile(data)
  }

  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Profile data update completed successfully!',
    loadingMsg: 'Profile is updating',
  })

  const name = watch('name')
  const username = watch('username')
  const bio = watch('bio')
  const email = watch('email')
  const websiteUrl = watch('websiteUrl')
  const telegram = watch('telegram')
  const twitter = watch('twitter')
  const discord = watch('discord')

  return (
    <>
      <BaseModal
        {...modalProps}
      />
      <PageLayout css={{ minHeight: '100vh' }}>
        <ReturnButton />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <StyledTitle>Profile settings</StyledTitle>
          <GrayBgText YourWalletStyled>
            <Txt primary1>
              Your wallet:
            </Txt>
            <Txt body4>{address ?? 'Please connect the wallet'}</Txt>
          </GrayBgText>
          <AppearanceSection<IProfileSettings>
            name={{
              control,
              name: 'name',
              rules: {
                validate: () => {
                  if (!name) return

                  return name.length > 3 && name.length < 50 ? undefined : 'The name must have more than 3 characters and less than 50 characters'
                },
              },
            }}
            url={{
              control,
              name: 'username',
              rules: {
                validate: () => {
                  if (!username) return
                  if (username.length < 3 || username.length > 50) return 'The username must have more than 3 characters and less than 50 characters'
                  if (!username.match(/^[a-z0-9_]+$/) || (username[0] === '0' && username[1] === 'x')) return 'Please enter valid username'
                },
              },
            }}
            bio={{
              control,
              name: 'bio',
              rules: {
                validate: () => {
                  if (!bio) return

                  return bio.length < 1000 ? undefined : 'The bio must have less than 1000 characters'
                },
              },
            }}
          />
          <Notifications<IProfileSettings>
            email={{
              control,
              name: 'email',
              rules: {
                validate: () => {
                  if (!email) return

                  return email?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) ? undefined : 'Please enter valid email'
                },
              },
            }}
            emailNotification={{
              control,
              name: 'isEmailNotificationEnabled',
            }}
          // pushNotification={{
          //   control,
          //   name: 'isEnablePushNotification',
          // }}
          />
          <Links<IProfileSettings>
            websiteUrl={{
              control,
              name: 'websiteUrl',
              rules: {
                validate: () => {
                  if (!websiteUrl) return
                  if (websiteUrl.length > 50) return 'The url less than 50 characters'

                  return websiteUrl?.match(/^(https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/) ? undefined : 'Please enter valid email'
                },
              },
            }}
            twitter={{
              control,
              name: 'twitter',
              rules: {
                validate: () => {
                  if (!twitter) return

                  return twitter.length < 50 ? undefined : 'The twitter must have less than 1000 characters'
                },
              },
            }}
            telegram={{
              control,
              name: 'telegram',
              rules: {
                validate: () => {
                  if (!telegram) return

                  return telegram.length < 50 ? undefined : 'The telegram must have less than 1000 characters'
                },
              },
            }}
            discord={{
              control,
              name: 'discord',
              rules: {
                validate: () => {
                  if (!discord) return

                  return discord.length < 50 ? undefined : 'The discord must have less than 1000 characters'
                },
              },
            }}
          />
          <Button
            primary
            type='submit'
            isDisabled={!!Object.keys(errors).length}
            title={!Object.keys(errors).length ? undefined : 'Required fields must be filled'}
            css={{
              width: '240px',
            }}
          >
            Update profile
          </Button>
        </Form>
      </PageLayout>
    </>
  )
})
