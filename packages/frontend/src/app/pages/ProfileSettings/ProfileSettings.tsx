import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../../components/Modal/Modal'
import { useModalProperties } from '../../hooks/useModalProperties'
import { Button, PageLayout, Txt } from '../../UIkit'
import ReturnButton from './components/ReturnButton/ReturnButton'
import { useUpdateProfile } from './helper/hooks/useUpdateProfile'
import { IProfileSettings } from './helper/types/formType'
import { Form, GrayBgText, StyledTitle } from './ProfileSettings.styles'
import AppearanceSection from './sections/Appereance/Appereance'
import Links from './sections/Links/Links'
import Notifications from './sections/Notifications/Notifications'

export default function ProfileSettings() {
  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<IProfileSettings>()

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
  }, [errors])

  return (
    <>
      {/* <BaseModal */}
      {/*  body={modalBody} */}
      {/*  open={modalOpen} */}
      {/*  isError={!!error} */}
      {/*  handleClose={() => { */}
      {/*    setModalOpen(false) */}
      {/*  }} */}
      {/* /> */}
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
            }}
            url={{
              control,
              name: 'url',
            }}
            bio={{
              control,
              name: 'bio',
            }}
          />
          <Notifications<IProfileSettings>
            email={{
              control,
              name: 'email',
            }}
            emailNotification={{
              control,
              name: 'isEnableEmailNotification',
            }}
            pushNotification={{
              control,
              name: 'isEnablePushNotification',
            }}
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
}
