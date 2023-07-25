import React from 'react'

import { styled } from '../../../../styles'
import { Container } from '../../../UIkit'
import EmailForm from '../components/EmailForm/EmailForm'
import CirclesImg from '../img/KeepTouch/Circles.svg'
import GridImg from '../img/KeepTouch/Grid.svg'

const KeepTouchBlockStyled = styled('div', {
  width: '99vw',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  background: `url(${CirclesImg}), url(${GridImg})`,
  backgroundPosition: 'top 50% left 30px, top 50% right 70px',
  backgroundRepeat: 'no-repeat',
  marginLeft: 'calc(((100vw - $breakpoints$xl) * 0.3 + $space$4) * -1)',
  '@xl': {
    marginLeft: 'calc(((100vw - $breakpoints$lg) * 0.554 + $space$4) * -1)',
  },
  '@lg': {
    marginLeft: 'calc(((100vw - $breakpoints$md) * 0.554 + $space$4) * -1)',
  },
  '@md': {
    background: 'none',
    width: '100%',
    marginLeft: '0',
  },
})

const KeepTouchBlock = () => {
  return (
    <KeepTouchBlockStyled>
      <Container>
        <EmailForm />
      </Container>
    </KeepTouchBlockStyled>
  )
}

export default KeepTouchBlock
