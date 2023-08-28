import React, { useEffect, useState } from 'react'

import { useStores } from '../../../hooks'
import { useAfterDidMountEffect } from '../../../hooks/useDidMountEffect'
import { useJwtAuth } from '../../../hooks/useJwtAuth'
import { useModalProperties } from '../../../hooks/useModalProperties'
import { useUpdateProfile } from '../../../pages/ProfileSettings/helper/hooks/useUpdateProfile'
import { useUploadLighthouse } from '../../../processing'
import { gradientPlaceholderImg } from '../../../UIkit'
import { BaseModal } from '../../Modal'
import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../../Modal/Modal'
import {
  EditProfileImageDialog,
  IEditProfileImageDialogForm,
} from './EditProfileImageDialog/EditProfileImageDialog'
import ChangeLogoImg from './img/ChangeLogo.png'
import { StyledProfileCameraImage, StyledProfileImage, StyledProfileImageContent } from './ProfileImage.styles'

interface IProfileImageProps {
  src?: string
  isOwner?: boolean
  onSuccess?: () => void
}

const ProfileImage = ({ src, isOwner, onSuccess }: IProfileImageProps) => {
  const [isShowEdit, setIsShowEdit] = useState<boolean>(false)

  const { dialogStore, userStore } = useStores()
  const upload = useUploadLighthouse()
  const openWindow = () => {
    dialogStore.openDialog({
      component: EditProfileImageDialog,
      props: {
        onSubmit: updateProfileFunc,

      },
    })
  }

  const updateProfileFunc = async (item: IEditProfileImageDialogForm) => {
    const url = await upload(item.image[0])
    updateProfile({
      ...userStore.user,
      avatarUrl: url.url,
    })
  }

  const connectFunc = useJwtAuth({
    isWithSign: true,
    onSuccess: () => {
      openWindow()
    },
  })

  const { modalBody, setModalBody, modalOpen, setModalOpen } =
    useModalProperties()

  const {
    error,
    isLoading,
    result,
    updateProfile,
  } = useUpdateProfile(onSuccess)

  useAfterDidMountEffect(() => {
    if (isLoading) {
      setModalOpen(true)
      setModalBody(<InProgressBody text='Avatar is updating' />)
    } else if (result) {
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
  }, [error, isLoading])

  useEffect(() => {
    updateProfile({})
  }, [])

  return (
    <StyledProfileImage
      onMouseEnter={() => setIsShowEdit(true)}
      onMouseLeave={() => setIsShowEdit(false)}
    >
      <BaseModal
        body={modalBody}
        open={modalOpen}
        isError={!!error}
        handleClose={() => {
          setModalOpen(false)
        }}
      />
      <StyledProfileImageContent style={{
        backgroundImage: `url(${!!src ? src : gradientPlaceholderImg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      >
        {
          (isShowEdit && isOwner) && (
            <StyledProfileCameraImage
              src={ChangeLogoImg}
              onClick={() => {
                connectFunc()
              }
              }
            />
          )}
      </StyledProfileImageContent>
    </StyledProfileImage>
  )
}

export default ProfileImage
