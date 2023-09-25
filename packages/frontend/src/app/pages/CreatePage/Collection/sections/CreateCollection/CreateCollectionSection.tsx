import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import BaseModal, { ErrorBody, extractMessageFromError, InProgressBody, SuccessNavBody } from '../../../../../components/Modal/Modal'
import ImageLoader from '../../../../../components/Uploaders/ImageLoader/ImageLoader'
import { useCurrentBlockChain } from '../../../../../hooks/useCurrentBlockChain'
import { useAfterDidMountEffect } from '../../../../../hooks/useDidMountEffect'
import { useModalProperties } from '../../../../../hooks/useModalProperties'
import { Button, FormControl, Input, PageLayout } from '../../../../../UIkit'
import { TextArea } from '../../../../../UIkit/Form/TextArea/TextArea'
import {
  ButtonContainer,
  Description,
  Form,
  Label,
  LabelWithCounter, LetterCounter,
  TextBold, TextGray,
  Title,
  TitleGroup,
} from '../../../helper/style/style'
import { useCreateCollection } from '../../../hooks/useCreateCollection'

export interface CreateCollectionForm {
  image: FileList
  name: string
  symbol: string
  description: string
}

export default function CreateCollectionSection() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    resetField,
    control,
    setValue,
  } = useForm<CreateCollectionForm>()

  const {
    error,
    isLoading,
    result,
    createCollection: mintCollection,
  } = useCreateCollection()

  const onSubmit: SubmitHandler<CreateCollectionForm> = (data) => {
    mintCollection(data)
  }

  const { modalBody, setModalBody, modalOpen, setModalOpen } =
    useModalProperties()

  const currentBlockChainStore = useCurrentBlockChain()

  useAfterDidMountEffect(() => {
    if (isLoading) {
      setModalOpen(true)
      void setModalBody(<InProgressBody text='Collection is being minted' />)
    } else if (error) {
      setModalOpen(true)
      void setModalBody(
        <ErrorBody
          message={extractMessageFromError(error)}
          onClose={() => {
            void setModalOpen(false)
          }
          }
        />,
      )
    } else if (result) {
      void setModalOpen(true)
      void setModalBody(
        <SuccessNavBody
          buttonText='View collection'
          link={`/collection/${currentBlockChainStore.chain?.name}/${result.collectionAddress}`}
          onPress={() => {
            setModalOpen(false)
          }}
        />,
      )
    }
  }, [error, isLoading, result])

  const [textareaLength, setTextareaLength] = useState(
    getValues('description')?.length ?? 0,
  )

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
      <PageLayout css={{ minHeight: '100vh' }} isHasSelectBlockChain>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TitleGroup><Title>Create New Collection</Title></TitleGroup>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload a Logo</Label>
            <Description style={{ width: '320px' }}>
              <TextBold>Formats:</TextBold>
              {' '}
              JPG, PNG or GIF.
              <TextBold> Max size:</TextBold>
              {' '}
              100 MB.
              {' '}
              <TextBold>Recommended size:</TextBold>
              {' '}
              300x300 px
            </Description>
            <ImageLoader
              registerProps={register('image', { required: true })}
              resetField={resetField}
            />
          </FormControl>

          <FormControl>
            <Label>Display name</Label>
            <Input<CreateCollectionForm>
              withoutDefaultBorder
              placeholder='Collection name'
              controlledInputProps={{
                control,
                name: 'name',
                rules: { required: true },
                setValue,
              }}
            />
          </FormControl>

          <FormControl>
            <Label>Symbol</Label>
            <Input<CreateCollectionForm>
              withoutDefaultBorder
              placeholder='Token symbol'
              controlledInputProps={{
                control,
                name: 'symbol',
                rules: { required: true },
                setValue,
              }}
            />
          </FormControl>

          <FormControl>
            <LabelWithCounter>
              <Label>
                Description&nbsp;&nbsp;
                <TextGray>(Optional)</TextGray>
              </Label>
              <LetterCounter>
                {textareaLength}
                /1000
              </LetterCounter>
            </LabelWithCounter>

            <TextArea<CreateCollectionForm>
              withoutDefaultBorder
              mint
              controlledInputProps={{
                control,
                name: 'description',
              }}
              { ...control.register('description', {
                onChange(event) {
                  setTextareaLength(event?.target?.value?.length ?? 0)
                },
                maxLength: 1000,
              })
              }
              placeholder='Description of your token collection'
            />
          </FormControl>

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
              Mint
            </Button>
          </ButtonContainer>
        </Form>
      </PageLayout>
    </>
  )
}
