import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../../components/Modal/Modal'
import { useModalProperties } from '../../hooks/useModalProperties'
import { Button, PageLayout } from '../../UIkit'
import { useUpdateProfile } from './helper/hooks/useUpdateProfile'
import { IProfileSettings } from './helper/types/formType'
import { ButtonContainer, Form } from './ProfileSettings.styles'
import AppearanceSection from './sections/Appereance/Appereance'
import Links from './sections/Links/Links'
import Notifications from './sections/Notifications/Notifications'

export default function ProfileSettings() {
  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm<IProfileSettings>()

  const {
    error,
    isLoading,
    result,
    updateProfile,
  } = useUpdateProfile()

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
      <PageLayout css={{ minHeight: '100vh' }} isHasSelectBlockChain>
        <Form onSubmit={handleSubmit(onSubmit)}>

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
          <ButtonContainer>
            <Button
              primary
              type='submit'
              isDisabled={!isValid}
              title={isValid ? undefined : 'Required fields must be filled'}
              css={{
                width: '320px',
              }}
            >
              Update profile
            </Button>
          </ButtonContainer>
        </Form>
      </PageLayout>
    </>
  )
}
