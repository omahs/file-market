import { Checkbox as CheckBoxDefault } from '@mui/material'
import React, { ComponentProps, ReactNode } from 'react'
import {
  Control,
  Controller, FieldValues, Path,
} from 'react-hook-form'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'

export interface ControlledCheckBoxProps<T extends FieldValues> {
  control: Control<T, any>
  name: Path<T>
  placeholder?: string
  rules?: RegisterOptions
}

export type CheckBoxProps = & {
  errorMessage?: string
}

export type CheckBoxControlProps<T extends FieldValues> = CheckBoxProps & ComponentProps<typeof CheckBoxDefault> & {
  errorMessage?: string
  controlledCheckBoxProps: ControlledCheckBoxProps<T>
  after?: string
  children?: ReactNode
}

export const CheckBox = <T extends FieldValues>({
  after,
  errorMessage,
  controlledCheckBoxProps,
  children,
  ...inputProps
}: CheckBoxControlProps<T>) => {
  return (
    <Controller
      control={controlledCheckBoxProps?.control}
      name={controlledCheckBoxProps?.name}
      rules={controlledCheckBoxProps?.rules}
      render={({ field }) => (
        <CheckBoxDefault
          {...inputProps}
          {...field}
        >
          {children}
        </CheckBoxDefault>
      )}
    />
  )
}
