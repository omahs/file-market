import { useDrop } from '@react-aria/dnd'
import React, { type SyntheticEvent, useEffect, useState } from 'react'
import { type UseFormRegisterReturn, type UseFormResetField } from 'react-hook-form'

import { styled } from '../../../../styles'
import { type CreateNFTForm } from '../../../pages/CreatePage/EFT/sections/CreateEFT/CreateEFTSection'
import { textVariant } from '../../../UIkit'
import CrossImage from '../NftLoader/img/cross.svg'
import { CloseButton, CrossIcon, File } from '../NftLoader/NftLoader'
import ImgIcon from './img/ImagePreview.svg'

export interface ITypesLoader {
  avatar?: boolean
  banner?: boolean
}

const Shade = styled('div', {
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 'inherit',
  transition: 'all 0.15s ease-in-out',
  zIndex: 1,
  variants: {
    avatar: {
      true: {

      },
    },
    banner: {
      true: {

      },
    },
    selected: {
      true: {
        zIndex: 0,
        background: 'rgba(0, 0, 0, 0)',
      },
    },
  },
})

const P = styled('p', {
  position: 'relative',
  transition: 'all 0.15s ease-in-out',
  variants: {
    selected: {
      true: {
        opacity: 0,
        zIndex: 1,
      },
    },
  },
})

const FileStyle = styled(File, {
  '&::before': {
    content: '""',
    position: 'absolute',
    transition: 'all 0.12s ease-in-out',
    zIndex: 2,
  },
  variants: {
    avatar: {
      true: {
        width: '160px',
        height: '160px !important',
        background: 'none',
        margin: '0 auto',
        boxShadow: 'none',
        borderRadius: '50%',
        '&::before': {
          width: '160px !important',
          height: '160px !important',
          borderRadius: '50%',
          border: '1px solid #0090FF',
        },
        '&:hover': {
          '&::before': {
            border: '4px solid #0090FF',
          },
        },
      },
    },
    banner: {
      true: {
        width: '400px',
        height: '100px !important',
        margin: '0 auto',
        boxShadow: 'none',
        '&::before': {
          width: '400px !important',
          height: '100px !important',
          border: '2px solid #0090FF',
          borderRadius: '16px',
        },
        '&:hover': {
          '&::before': {
            border: '4px solid #0090FF',
          },
        },
      },
    },
    isImageUpload: {
      true: {
        height: '320px',
        '&:hover': {
          boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
          '& img, p': {
            filter: 'brightness(100%)',
          },
        },
      },
    },
  },
})

const ImageIcon = styled('img', {
  width: 60,
  height: 60,
  transition: 'all 0.15s ease-in-out',
  variants: {
    avatar: {
      true: {
        width: '40px',
        height: '40px',
      },
    },
    banner: {
      true: {
        width: '40px',
        height: '40px',
      },
    },
    selected: {
      true: {
        opacity: 0,
        zIndex: 1,
      },
    },
  },
})

const FileImageContainer = styled('div', {
  position: 'relative',
  width: 320,
  height: 160,
  backgroundColor: '$white',
  color: '$blue500',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '18px',
  flexDirection: 'column',
  borderRadius: '$3',
  ...textVariant('primary1').true,
  variants: {
    avatar: {
      true: {
        width: '160px',
        height: 'i60px',
        background: 'none',
        borderRadius: '50%',
      },
    },
    banner: {
      true: {
        width: '400px',
        height: 'i00px',
        background: 'none',
      },
    },
    isImageUpload: {
      true: {
        height: '320px',
        backgroundSize: 'cover !important',
      },
    },
  },
})

const CloseButtonImageLoader = styled(CloseButton, {
  variants: {
    avatar: {
      true: {
        display: 'none',
      },
    },
  },
},
)

const FileInput = styled('input', {
  display: 'none',
})

interface ItemWithGetFileProperty {
  getFile: () => Promise<File>
}

interface ImageLoaderProps {
  registerProps?: UseFormRegisterReturn
  resetField: UseFormResetField<CreateNFTForm>
  typesLoader?: ITypesLoader
  text?: string
}

export default function ImageLoader(props: ImageLoaderProps) {
  const [file, setFile] = useState<File | undefined>()

  const setFileAsync = async (item: ItemWithGetFileProperty) => {
    const file = await item.getFile()
    setFile(file)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [preview, setPreview] = useState<string | undefined>()

  const ref = React.useRef(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dropProps, isDropTarget } = useDrop({
    ref,
    onDrop(e) {
      const item = e.items.find(
        (item) =>
          item.kind === 'file' &&
          (item.type === 'image/jpeg' ||
            item.type === 'image/png' ||
            item.type === 'image/gif'),
      )
      if (item) {
        void setFileAsync(item as unknown as ItemWithGetFileProperty)
      }
    },
  })

  useEffect(() => {
    if (!file) {
      setPreview(undefined)

      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => { URL.revokeObjectURL(objectUrl) }
  }, [file])

  const onSelectFile = (e: SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    if (!target.files || target.files.length === 0) {
      setFile(undefined)

      return
    }
    setFile(target.files[0])
  }

  return (
    <FileStyle htmlFor='inputTag' isImageUpload={!!file} {...props.typesLoader as any}>
      {file && (
        <CloseButtonImageLoader
          onPress={() => {
            props.resetField('image')
            setFile(undefined)
          }}
          {...props.typesLoader as any}
        >
          <CrossIcon src={CrossImage} />
        </CloseButtonImageLoader>
      )}
      <FileImageContainer
        {...dropProps}
        {...props.typesLoader}
        ref={ref}
        isImageUpload={!!file}
        css={{
          backgroundImage: `url('${preview}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Shade selected={Boolean(preview)} {...props.typesLoader as any} />
        <ImageIcon src={ImgIcon} selected={Boolean(preview)} {...props.typesLoader as any} />
        <P selected={Boolean(preview)}>{props.text ?? 'Choose Preview'}</P>
      </FileImageContainer>
      <FileInput
        id='inputTag'
        type='file'
        accept={'.jpg, .png, .gif'}
        {...props.registerProps}
        onChange={(e) => {
          onSelectFile(e)
          void props.registerProps?.onChange(e)
        }}
        {...props.typesLoader}
      />
    </FileStyle>
  )
}
