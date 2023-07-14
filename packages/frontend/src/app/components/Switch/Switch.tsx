import { ReactNode, useState } from 'react'

import { styled } from '../../../styles'

export const SwitchWrapper = styled('div', {
  display: 'inline-flex',
  columnGap: '$1',
  padding: '$2',
  borderRadius: '$4',
  border: '2px solid #0090FF',
  background: 'white',
  '@md': {
    padding: '6px',
  },
  '@sm': {
    columnGap: '0',
  },
})

export const SwitchButton = styled('button', {
  padding: '12px 36px',
  borderRadius: '$4',
  backgroundColor: 'transparent',
  fontFamily: '$body',
  fontSize: '$body2',
  fontWeight: '$primary',
  lineHeight: 'ternary3',
  color: '#0090FF',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: '2px solid transparent',
  '@md': {
    padding: '10px 24px',
    fontSize: '$body3',
  },
  '@sm': {
    padding: '8px 16px',
    fontSize: '$body4',
  },
  '@xs': {
    padding: '6px 14px',
  },
  '@media (max-width: 360px)': {
    padding: '6px 10px',
  },
  '@media (max-width: 320px)': {
    padding: '6px 8px',
  },
  '&:hover': {
    borderColor: '#0090FF',
  },
  variants: {
    activate: {
      true: {
        backgroundColor: '#0090FF',
        color: '$white',
      },
    },
  },
})

export interface OptionSwitch {
  label: ReactNode
  value: string
}

interface SwitchProps<T extends OptionSwitch> {
  options: T[]
  onChange: (value: string) => void
  initialValue?: string
}

export default function Switch<T extends OptionSwitch> ({ options, onChange, initialValue }: SwitchProps<T>) {
  const [currentOptionValue, setCurrentOptionValue] = useState<string>(initialValue ?? options[0].value)

  const handleSwitch = (optionValue: string) => {
    if (currentOptionValue === optionValue) return

    setCurrentOptionValue(optionValue)
    onChange(optionValue)
  }

  return (
    <SwitchWrapper>
      {options.map(option => (
        <SwitchButton
          key={option.value}
          activate={currentOptionValue === option.value}
          onClick={() => handleSwitch(option.value)}
        >
          {option.label}
        </SwitchButton>
      ),
      )}
    </SwitchWrapper>
  )
}
