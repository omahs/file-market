import React, { useMemo } from 'react'

import { Button, LinkButton, Txt } from '../../../../UIkit'
import { copyToClipboard } from '../../../../utils/clipboard/clipboard'
import { baseUrls, imgs } from '../../helper/linkCard/data'
import { typesCard } from '../../helper/linkCard/types'

interface ILinkCardProps {
  text: string
  type: typesCard
}

const LinkCard = ({ text, type }: ILinkCardProps) => {
  const img = useMemo(() => {
    return imgs[type]
  }, [type])

  const baseUrl = useMemo(() => {
    return baseUrls[type]
  }, [type])

  return (
    <>
      {type !== 'discord' && (
        <LinkButton href={`${baseUrl}${text}`} target={'_blank'} settings>
          <img src={img} />
          <Txt
            primary2
            style={{
              color: '#2F3134',
            }}
          >
            {text}
          </Txt>
        </LinkButton>
      )}
      {type === 'discord' && (
        <Button
          onClick={() => {
            copyToClipboard(text)
          }
          }
          target={'_blank'}
          settings
        >
          <img src={img} />
          <Txt
            primary2
            style={{
              color: '#2F3134',
            }}
          >
            {text}
          </Txt>
        </Button>
      )}
    </>
  )
}

export default LinkCard
