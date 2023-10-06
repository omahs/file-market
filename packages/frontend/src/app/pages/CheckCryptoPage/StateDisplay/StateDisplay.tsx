import { styled } from '@stitches/react'
import * as React from 'react'

import { textVariant } from '../../../UIkit'
import { type checkCryptoField } from '../helper/types/types'

const Text = styled('div', {
  ...textVariant('primary1').true,
  variants: {
    status: {
      waiting: {
        color: 'orange',
      },
      success: {
        color: 'green',
      },
      failed: {
        color: 'red',
      },
    },
  },
})

const StateDisplay = ({ state }: { state?: checkCryptoField }) => {
  return <Text status={state}>{state}</Text>
}

export default StateDisplay
