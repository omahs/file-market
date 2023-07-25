import { LinkButton, Txt } from '../../../../UIkit'

interface DownloadIconProps {
  bigIcon?: boolean
}

interface DownloadButtonProps {
  class?: string
  children: string
  downloadHref: string
  bigIcon?: boolean
  bigBtn?: boolean
}

const DownloadIcon = (props: DownloadIconProps) => (
  <svg
    width={props.bigIcon ? '24' : '20'}
    height={props.bigIcon ? '24' : '20'}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M12 3V16M12 16L8 12M12 16L16 12M21 17V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
)

const getFileName = (href: string) => {
  const parts = href.split('/')
  const fileName = parts[parts.length - 1].toLowerCase()

  return fileName
}

export default function DownloadButton(props: DownloadButtonProps) {
  return (
    <LinkButton
      whiteWithBlue
      style={{ columnGap: '8px', minHeight: '100%', backgroundColor: '#F9F9F9' }}
      href={props.downloadHref}
      download={getFileName(props.downloadHref)}
      bigHg={props.bigBtn}
      className={props.class}
    >
      <Txt body2 css={{ fontWeight: '$primary' }}>
        {props.children}
      </Txt>
      <DownloadIcon
        bigIcon={!!props.bigIcon}
      />
    </LinkButton>
  )
}
