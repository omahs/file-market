import React from 'react'

import DefaultBanner from '../../../assets/img/DefaultProfileBanner.svg'
import DefaultIcon from '../../../assets/img/DefaultProfileIcon.svg.svg'
import { Txt } from '../../UIkit'
import SettingsButton from './SettingsButton/SettingsButton'
import { Banner, IconNameContainer, MainInfoContainer, UserIconStyled } from './ViewInfo.styles'

const ViewInfo = () => {
  return (
    <div>
      <Banner src={DefaultBanner} css={{ minHeight: '100vh' }} />
      <MainInfoContainer>
        <IconNameContainer>
          <UserIconStyled src={DefaultIcon} />
          <Txt>{'Aleshka'}</Txt>
        </IconNameContainer>
        <SettingsButton />
      </MainInfoContainer>
    </div>
  )
}

export default ViewInfo
