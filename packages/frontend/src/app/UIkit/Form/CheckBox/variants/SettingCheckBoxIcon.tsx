import React from 'react'

import { styled } from '../../../../../styles'

const SettingCheckBoxIconStyled = styled('div', {
  borderRadius: '8px',
  border: '2px solid #A9ADB1',
  background: '#D9D9D9',
  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.25)',
  width: '28px',
  height: '28px',
})

export const SettingCheckBoxIcon = () => {
  return (
    <SettingCheckBoxIconStyled />
  )
}

const SettingCheckBoxIconActiveStyled = styled('div', {
  borderRadius: '8px',
  border: '2px solid #A9ADB1',
  background: '#D9D9D9',
  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.25)',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const SettingCheckBoxActiveIcon = () => {
  return (
    <SettingCheckBoxIconActiveStyled>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.7493 0L4.95043 6.60063L2.25073 3.97964L0.5 5.67932L4.95043 10L13.5 1.69969L11.7493 0Z"
          fill="white"
        />
      </svg>
    </SettingCheckBoxIconActiveStyled>
  )
}
