import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { BaseModal } from '../../components'
import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../../components/Modal/Modal'
import { useStores } from '../../hooks'
import { useModalProperties } from '../../hooks/useModalProperties'
import { Button, PageLayout, Txt } from '../../UIkit'
import ReturnButton from './components/ReturnButton/ReturnButton'
import { useUpdateProfile } from './helper/hooks/useUpdateProfile'
import { IProfileSettings } from './helper/types/formType'
import { Form, GrayBgText, StyledTitle } from './ProfileSettings.styles'
import AppearanceSection from './sections/Appereance/Appereance'
import Links from './sections/Links/Links'
import Notifications from './sections/Notifications/Notifications'

export default observer(function ProfileSettings() {
  const { userStore, profileStore } = useStores()

  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
    watch,
  } = useForm<IProfileSettings>({
    defaultValues: {
      name: userStore.user?.name,
      username: userStore.user?.username,
      bio: userStore.user?.bio,
      email: userStore.user?.email,
      website: userStore.user?.websiteUrl,
      twitter: userStore.user?.twitter,
    },
  })

  const {
    error,
    isLoading,
    result,
    updateProfile,
  } = useUpdateProfile(profileStore.reload)
  const { address } = useAccount()
  const onSubmit: SubmitHandler<IProfileSettings> = (data) => {
    updateProfile(data)
  }

  const { modalBody, setModalBody, modalOpen, setModalOpen } =
    useModalProperties()

  useEffect(() => {
    if (!isLoading) return

    void setModalBody(<InProgressBody text='Profile is being updated' />)
    void setModalOpen(true)
  }, [isLoading])

  useEffect(() => {
    if (!result) return

    void setModalBody(
      <SuccessOkBody
        description={'View collection'}
      />,
    )
    void setModalOpen(true)
  }, [result])

  useEffect(() => {
    if (!error) return

    void setModalBody(
      <ErrorBody
        message={extractMessageFromError(error)}
        onClose={() => {
          void setModalOpen(false)
        }
        }
      />,
    )
  }, [error])

  useEffect(() => {
    console.log(errors)
    console.log(isValid)
  }, [errors, isValid])

  const name = watch('name')
  const username = watch('username')
  const bio = watch('bio')
  const email = watch('email')

  return (
    <>
      <BaseModal
        body={modalBody}
        open={modalOpen}
        isError={!!error}
        handleClose={() => {
          setModalOpen(false)
        }}
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
                validate: () => name?.length > 3 && name?.length < 50 ? undefined : 'The name must have more than 3 characters and less than 50 characters',
              },
            }}
            url={{
              control,
              name: 'username',
              rules: {
                validate: () => {
                  console.log(username)
                  if (username?.length < 3 || username?.length > 50) return 'The username must have more than 3 characters and less than 50 characters'
                  if (!username?.match(/^[a-z0-9_]+$/) || (username?.[0] === '0' && username?.[1] === 'x')) return 'Please enter valid username'
                },
              },
            }}
            bio={{
              control,
              name: 'bio',
              rules: {
                validate: () => bio?.length > 1000 ? undefined : 'The bio must have less than 1000 characters',
              },
            }}
          />
          <Notifications<IProfileSettings>
            email={{
              control,
              name: 'email',
              rules: {
                validate: () => email?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) ? undefined : 'Please enter valid email',
              },
            }}
            emailNotification={{
              control,
              name: 'isEnableEmailNotification',
            }}
            // pushNotification={{
            //   control,
            //   name: 'isEnablePushNotification',
            // }}
          />
          <Links<IProfileSettings>
            website={{
              control,
              name: 'website',
            }}
            twitter={{
              control,
              name: 'twitter',
            }}
            telegram={{
              control,
              name: 'telegram',
            }}
            discord={{
              control,
              name: 'discord',
            }}
          />
          <Button
            primary
            type='submit'
            isDisabled={!isValid}
            title={isValid ? undefined : 'Required fields must be filled'}
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
