import * as React from 'react'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { type FieldValues } from 'react-hook-form'

import { styled } from '../../../../styles'
import { type ControlledInputProps, Input, type InputProps, Txt } from '../../../UIkit'

const TextStartInputStyle = styled('div', {
  width: '100%',
  position: 'relative',
  borderRadius: '12px',
  color: '#6B6F76',
  '& .leftText': {
    position: 'absolute',
    top: '15px',
    left: '16px',
    zIndex: '1',
    pointerEvents: 'none', // hover effect are lost without this
    '@md': {
      top: 14,
      fontSize: '15px',
    },
    '@sm': {
      top: 13,
      fontSize: '13px',
    },
    '@xs': {
      top: 12,
      fontSize: '12px',
    },
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
  const [refState, setRef] = useState<RefObject<HTMLSpanElement> | null>(null)

  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setRef(ref)
  }, [ref])

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
          paddingLeft: +(refState?.current?.clientWidth ?? 0) + 24,
        }}
      />
    </TextStartInputStyle>
  )
}
