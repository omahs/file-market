import { styled } from '@stitches/react'

import DownloadIconSrc from '../../../../../assets/img/BrandingPage/download-icon.svg'
import { LinkButton, Txt } from '../../../../UIkit'

interface DownloadButtonProps {
  class?: string
  children: string
  downloadHref: string
  bigIcon?: boolean
  bigBtn?: boolean
}

const DownloadButtonIcon = styled('img', {
  marginRight: '8px',
  variants: {
    iconSize: {
      default: {
        width: '20px',
        height: '20px',
      },
      big: {
        width: '24px',
        height: '24px',
      },
    },
  },
})

const getFileName = (href: string) => {
  const parts = href.split('/')
  const fileName = parts[parts.length - 1].toLowerCase()

  return fileName
}

export default function DownloadButton(props: DownloadButtonProps) {
  return (
    <LinkButton
      whiteWithBlue
      style={{ columnGap: '8px', minHeight: '100%' }}
      href={props.downloadHref}
      download={getFileName(props.downloadHref)}
      bigHg={props.bigBtn}
      className={props.class}
    >
      <Txt body2 css={{ fontWeight: '$primary' }}>
        {props.children}
      </Txt>
      <DownloadButtonIcon
        src={DownloadIconSrc}
        iconSize={props.bigIcon ? 'big' : 'default'}
      />
    </LinkButton>
  )
}
