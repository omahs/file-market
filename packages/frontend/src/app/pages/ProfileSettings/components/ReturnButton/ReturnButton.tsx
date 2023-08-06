import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { Button, Txt } from '../../../../UIkit'

const ReturnButtonStyle = styled(Button, {
  position: 'fixed',
  '@md': {
    display: 'none',
  },
})

const ReturnButton = () => {
  const navigate = useNavigate()

  return (
    <ReturnButtonStyle
      settings
      onPress={() => {
        navigate('/profile')
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6 11L1 6M1 6L6 1M1 6L11 6"
          stroke="#A9ADB1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Txt primary2>return</Txt>
    </ReturnButtonStyle>
  )
}

export default ReturnButton
