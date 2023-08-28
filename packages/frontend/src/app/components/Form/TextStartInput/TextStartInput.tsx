import * as React from 'react'
import { useRef } from 'react'
import { FieldValues } from 'react-hook-form'

import { styled } from '../../../../styles'
import { ControlledInputProps, glow, Input, InputProps, Txt } from '../../../UIkit'

const TextStartInputStyle = styled('div', {
  width: '100%',
  position: 'relative',
  outline: '2px solid #C9CBCF',
  height: '48px',
  borderRadius: '12px',
  color: '#6B6F76',
  '& span': {
    position: 'absolute',
    cursor: 'pointer',
    top: '14px',
    left: '16px',
    zIndex: '1',
    '&:hover': {
      filter: 'brightness(110%)',
    },
  },
  '&:hover': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '1px solid $blue500',
  },
  '&:focus': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`,
  },
  '&:focus-within': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`,
  },
})

interface TextStartInputProps<T extends FieldValues> {
  inputProps: InputProps
  controlledInputProps: ControlledInputProps<T>
  isCanReset?: boolean
  textStart?: string
}

export const TextStartInput = <T extends FieldValues>(props: TextStartInputProps<T>) => {
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <TextStartInputStyle>
      {props.textStart && (
        <Txt
          ref={ref}
          primary1
        >
          {props.textStart}
        </Txt>
      )}
      <Input<T>
        {...props.inputProps}
        textStartInput
        controlledInputProps={props.controlledInputProps}
        placeholder={props.inputProps.placeholder ?? 'Start typing'}
        style={{
          height: '100%',
          width: '100%',
          paddingLeft: +(ref?.current?.clientWidth ?? 0) + 24,
        }}
      />
    </TextStartInputStyle>
  )
}
