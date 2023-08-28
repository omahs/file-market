import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../../styles'
import { useJwtAuth } from '../../../hooks/useJwtAuth'
import { Button } from '../../../UIkit'

const StyledSettingsButton = styled(Button, {
  '@sm': {
    position: 'absolute',
    right: '16px',
  },
})

const SettingsButton = observer(() => {
  const navigate = useNavigate()
  const connectFunc = useJwtAuth({ isWithSign: true, onSuccess: () => { navigate('/settings') } })

  return (
    <StyledSettingsButton
      style={{
        height: 'max-content',
        padding: '8px',
        marginTop: '12px',
      }}
      settings
      onClick={connectFunc}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.5 1C7.5 0.447715 7.94772 0 8.5 0H11.5C12.0523 0 12.5 0.447715 12.5 1V2.93677C12.5 3.38223 13.0386 3.60531 13.3536 3.29033L14.6868 1.95711C15.0773 1.56658 15.7105 1.56658 16.101 1.95711L18.2223 4.07843C18.6128 4.46895 18.6128 5.10212 18.2223 5.49264L17.0685 6.64645C16.7535 6.96143 16.9766 7.5 17.4221 7.5H19C19.5523 7.5 20 7.94772 20 8.5V11.5C20 12.0523 19.5523 12.5 19 12.5H17.2439C16.7984 12.5 16.5754 13.0386 16.8903 13.3536L18.2219 14.6851C18.6125 15.0757 18.6125 15.7088 18.2219 16.0994L16.1006 18.2207C15.7101 18.6112 15.0769 18.6112 14.6864 18.2207L13.3536 16.8878C13.0386 16.5729 12.5 16.7959 12.5 17.2414V19C12.5 19.5523 12.0523 20 11.5 20H8.5C7.94772 20 7.5 19.5523 7.5 19V17.4221C7.5 16.9766 6.96143 16.7535 6.64645 17.0685L5.49439 18.2206C5.10386 18.6111 4.4707 18.6111 4.08017 18.2206L1.95885 16.0992C1.56833 15.7087 1.56833 15.0756 1.95885 14.685L3.29033 13.3536C3.60531 13.0386 3.38223 12.5 2.93677 12.5H1C0.447715 12.5 0 12.0523 0 11.5V8.5C0 7.94771 0.447715 7.5 1 7.5H2.75861C3.20406 7.5 3.42714 6.96143 3.11216 6.64645L1.95847 5.49276C1.56795 5.10223 1.56795 4.46907 1.95847 4.07854L4.07979 1.95722C4.47032 1.5667 5.10348 1.5667 5.49401 1.95722L6.64645 3.10966C6.96143 3.42464 7.5 3.20156 7.5 2.75611V1ZM10 13.75C12.0711 13.75 13.75 12.0711 13.75 10C13.75 7.92893 12.0711 6.25 10 6.25C7.92893 6.25 6.25 7.92893 6.25 10C6.25 12.0711 7.92893 13.75 10 13.75Z"
          fill="#A9ADB1"
        />
      </svg>
    </StyledSettingsButton>
  )
})

export default SettingsButton
