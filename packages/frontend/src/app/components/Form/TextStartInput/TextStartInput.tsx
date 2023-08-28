import * as React from 'react'
import { useRef } from 'react'
import { FieldValues } from 'react-hook-form'

import { styled } from '../../../../styles'
import { ControlledInputProps, Input, InputProps, Txt } from '../../../UIkit'

const TextStartInputStyle = styled('div', {
  width: '100%',
  position: 'relative',
  borderRadius: '12px',
  color: '#6B6F76',
  '& .leftText': {
    position: 'absolute',
    cursor: 'pointer',
    top: '14px',
    left: '16px',
    zIndex: '1',
    '&:hover': {
      filter: 'brightness(110%)',
    },
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
          className={'leftText'}
        >
          {props.textStart}
        </Txt>
      )}
      <Input<T>
        {...props.inputProps}
        controlledInputProps={props.controlledInputProps}
        placeholder={props.inputProps.placeholder ?? 'Start typing'}
        style={{
          width: '100%',
          paddingLeft: +(ref?.current?.clientWidth ?? 0) + 24,
        }}
      />
    </TextStartInputStyle>
  )
}
