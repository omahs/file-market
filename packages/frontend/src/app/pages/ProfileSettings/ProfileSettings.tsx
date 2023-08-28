import { observer } from 'mobx-react-lite'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { BaseModal } from '../../components'
import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../../components/Modal/Modal'
import { useStores } from '../../hooks'
import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
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
  const { userStore } = useStores()

  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
    watch,
  } = useForm<IProfileSettings>({
    mode: 'onBlur',
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
  } = useUpdateProfile()
  const { address } = useAccount()
  const onSubmit: SubmitHandler<IProfileSettings> = (data) => {
    updateProfile(data)
  }

  const { modalBody, setModalBody, modalOpen, setModalOpen } =
    useModalProperties()

  useAfterDidMountEffect(() => {
    if (isLoading) {
      setModalOpen(true)
      setModalBody(<InProgressBody text='Profile is updating' />)
    } else if (error) {
      setModalOpen(true)
      setModalBody(
        <ErrorBody
          message={extractMessageFromError(result)}
          onClose={() => {
            void setModalOpen(false)
          }}
        />,
      )
    } else if (result) {
      setModalOpen(true)
      setModalBody(
        <SuccessOkBody
          buttonText='View EFT'
          description={'Profile success'}
        />,
      )
    }
  }, [error, isLoading, result])

  const name = watch('name')
  const username = watch('username')
  const bio = watch('bio')
  const email = watch('email')
  const website = watch('website')

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
              rules: {
                validate: () => {
                  if (!website) return

                  return website?.match(/^(https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/) ? undefined : 'Please enter valid email'
                },
              },
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
