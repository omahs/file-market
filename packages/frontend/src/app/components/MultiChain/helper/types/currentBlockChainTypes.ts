import { ComponentProps } from '@stitches/react'

import { CurrentBlockchainStyle } from '../../CurrentBlockchain/CurrentBlockchain.styles'

export type ICurrentBlockchain = ComponentProps<typeof CurrentBlockchainStyle> & {
  isVisible?: boolean
}
