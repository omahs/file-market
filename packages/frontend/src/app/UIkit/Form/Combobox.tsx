/* eslint-disable multiline-ternary */
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled'
import { AutocompleteChangeReason } from '@mui/material'
import { Loading } from '@nextui-org/react'
import * as React from 'react'
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path
} from 'react-hook-form'

import { styled } from '../../../styles'
import bottomArrow from './img/arrow-bottom.svg'
import PostfixedInput from './PostfixedInput'

const Listbox = styled('ul', {
  maxWidth: '600px',
  width: '100%',
  margin: 0,
  zIndex: 1,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: '$white',
  overflow: 'auto',
  maxHeight: 200,
  border: '2px solid transparent',
  borderRadius: '$2',
  '& li': {
    color: '$blue900',
    backgroundColor: '$white',
    padding: 'calc($3 - $1)'
  },
  '& li.Mui-focused': {
    backgroundColor: '#4a8df6',
    color: 'white',
    cursor: 'pointer'
  },
  '& li:active': {
    backgroundColor: '#2977f5',
    color: 'white'
  }
})

const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4'
})

export interface ComboBoxOption {
  title: string
  id: string
}

interface ComboboxProps<T extends FieldValues> {
  options: ComboBoxOption[]
  value: ComboBoxOption
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    data: ComboBoxOption | null,
    reason: AutocompleteChangeReason
  ) => void
  onEnter?: (value?: string) => void
  otherFieldProps?: ControllerRenderProps<T, Path<T>>
  isLoading?: boolean
  placeholder?: string
  isDisabled?: boolean
}

function UncontrolledCombobox<T extends FieldValues>(props: ComboboxProps<T>) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue
  } = useAutocomplete({
    options: props.options,
    getOptionLabel: (option) => option.title,
    isOptionEqualToValue: (option1, option2) => option1?.id === option2?.id,
    ...props.otherFieldProps,
    value: props.otherFieldProps?.value ?? null,
    onChange: props.onChange,
    readOnly: props.isDisabled
  })

  const ContentLoaded = () => {
    return (
      <>
        {(groupedOptions as typeof props.options).map((option, index) => (
          <li {...getOptionProps({ option, index })} key={option.id}>
            {option.title}
          </li>
        ))}
      </>
    )
  }

  const ContentLoading = () => {
    return (
      <LoadingContainer>
        <Loading size='xl' type='points' />
      </LoadingContainer>
    )
  }

  const Content = (): JSX.Element => {
    if (props.isLoading) return <ContentLoading />

    return <ContentLoaded />
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue) {
      props.onEnter?.(inputValue as string)
      event.preventDefault()

      return false
    }
  }

  return (
    <div>
      <div {...getRootProps()}>
        <PostfixedInput
          placeholder={props.placeholder ?? 'Select collection'}
          postfix={<img width={24} height={24} src={bottomArrow} />}
          inputProps={{
            ...getInputProps(),
            onKeyDown: handleKeyDown
          }}
          postfixProps={{
            onPress: handleKeyDown
          }}
        />
      </div>
      {groupedOptions?.length > 0 && (
        <Listbox {...getListboxProps()}>
          <Content />
        </Listbox>
      )}
    </div>
  )
}

export interface ControlledComboboxProps<T extends FieldValues> {
  comboboxProps: Omit<ComboboxProps<T>, 'onChange' | 'value'>
  control: Control<T, any>
  name: Path<T>
  placeholder?: string
  rules?: {
    required?: boolean
  }
  onEnter?: (value?: string) => void
  isDisabled?: boolean
}

export const ControlledComboBox = <T extends FieldValues>(
  props: ControlledComboboxProps<T>
) => (
  <Controller
    control={props.control}
    name={props.name}
    rules={props.rules}
    render={(p) => (
      <UncontrolledCombobox
        options={props.comboboxProps.options}
        value={p.field.value}
        otherFieldProps={p.field}
        placeholder={props.placeholder}
        isDisabled={props.isDisabled}
        onChange={(_, data) => p.field.onChange(data)}
        onEnter={props.onEnter}
      />
    )}
  />
)
