import React, { useState } from 'react'

import { useStores } from '../../../hooks'
import { useAfterDidMountEffect } from '../../../hooks/useDidMountEffect'
import { useJwtAuth } from '../../../hooks/useJwtAuth'
import { useModalProperties } from '../../../hooks/useModalProperties'
import { useUpdateProfile } from '../../../pages/ProfileSettings/helper/hooks/useUpdateProfile'
import { useUploadLighthouse } from '../../../processing'
import { Txt } from '../../../UIkit'
import { BaseModal } from '../../Modal'
import { ErrorBody, extractMessageFromError, InProgressBody, SuccessOkBody } from '../../Modal/Modal'
import {
  IEditProfileImageDialogForm,
} from '../ProfileImage/EditProfileImageDialog/EditProfileImageDialog'
import { StyledBanner, StyledBannerContent, StyledBannerEditCard } from './Banner.styles'
import { EditProfileBannerDialog } from './EditProfileBannerDialog/EditProfileBannerDialog'

interface IProfileImageProps {
  src?: string
  isOwner?: boolean
  onSuccess?: () => void
}

const Banner = ({ src, isOwner, onSuccess }: IProfileImageProps) => {
  const [isShowEdit, setIsShowEdit] = useState<boolean>(false)
  const { dialogStore, userStore } = useStores()
  const upload = useUploadLighthouse()
  const openWindow = () => {
    dialogStore.openDialog({
      component: EditProfileBannerDialog,
      props: {
        onSubmit: updateProfileFunc,
      },
    })
  }

  const updateProfileFunc = async (item: IEditProfileImageDialogForm) => {
    const url = await upload(item.image[0])
    updateProfile({
      ...userStore.user,
      bannerUrl: url.url,
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
      setModalBody(<InProgressBody text='Banner is updating' />)
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

  return (
    <StyledBanner
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
      <StyledBannerContent style={{
        backgroundImage: !!src ? `url(${src})` : 'linear-gradient(135deg, #028FFF 0%, #04E762 100%)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      >
        {
          (isShowEdit && isOwner) && (
            <StyledBannerEditCard onClick={() => {
              connectFunc()
            }}
            >
              <Txt primary1>Edit cover</Txt>
            </StyledBannerEditCard>
          )}
      </StyledBannerContent>
    </StyledBanner>
  )
}

export default Banner
