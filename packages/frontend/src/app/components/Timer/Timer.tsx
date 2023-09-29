import React, { type FC } from 'react'

import { styled } from '../../../styles'
import { Txt } from '../../UIkit'
import { formatTime } from '../../utils/time/formatTime'
import { timeConvertToMinuteFromMillSec, timeConvertToSecondsFromMillSec } from '../../utils/time/timeConvert'

const TimerStyle = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '& .content': {
    textAlign: 'center',
    color: 'rgb(0, 144, 255)',
  },
})

interface TimerProps {
  time: number
}

export const Timer: FC<TimerProps> = ({ time }) => {
  return (
    <TimerStyle>
      <Txt className={'content'} primary1>
        {`${formatTime(Math.trunc(timeConvertToMinuteFromMillSec(time)))}
        :${formatTime(Math.trunc(timeConvertToSecondsFromMillSec(time) % 60))}`}
      </Txt>
    </TimerStyle>
  )
}
