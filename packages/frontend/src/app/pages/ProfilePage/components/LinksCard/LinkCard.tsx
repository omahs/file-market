import React, { useMemo } from 'react'

import { Button, NavButton, Txt } from '../../../../UIkit'
import { imgs } from '../../helper/linkCard/data'
import { typesCard } from '../../helper/linkCard/types'

interface ILinkCardProps {
  text: string
  type: typesCard
}

const LinkCard = ({ text, type }: ILinkCardProps) => {
  const img = useMemo(() => {
    return imgs[type]
  }, [type])

  return (
    <>
      {type === 'url' && (
        <NavButton to={text} settings>
          <img src={img} />
          <Txt
            primary2
            style={{
              color: '#2F3134',
            }}
          >
            {text}
          </Txt>
        </NavButton>
      )}
      {type !== 'url' && (
        <Button settings>
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
      )
      }
    </>
  )
}

export default LinkCard
