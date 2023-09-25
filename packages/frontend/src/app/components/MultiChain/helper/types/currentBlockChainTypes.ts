import { type ComponentProps } from '@stitches/react'

import { type CurrentBlockchainStyle } from '../../CurrentBlockchain/CurrentBlockchain.styles'

export type ICurrentBlockchain = ComponentProps<typeof CurrentBlockchainStyle> & {
  isVisible?: boolean
}
