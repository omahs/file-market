import React from 'react'

import { styled } from '../../../../styles'
import { Txt } from '../../../UIkit'

const FAQPageStyle = styled('div', {
  background: '#F9F9F9'
})

const FAQPageContainer = styled('div', {
  background: 'white',
  maxWidth: '800px',
  margin: '0 auto',
  minHeight: '100vh',
  paddingRight: '80px',
  paddingLeft: '80px',
  paddingTop: 'calc($layout$navBarHeight + 44px)',
  '@md': {
    maxWidth: '90%'
  }
})

const FAQPage = () => {
  return (
    <FAQPageStyle>
      <FAQPageContainer>
        <Txt primary1 style={{ fontSize: '48px', lineHeight: '60px' }}>FAQ</Txt>
      </FAQPageContainer>
    </FAQPageStyle>
  )
}

export default FAQPage
