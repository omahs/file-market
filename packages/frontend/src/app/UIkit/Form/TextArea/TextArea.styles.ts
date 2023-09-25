import { styled } from '../../../../styles'
import { textFieldsStyles } from '../TextFields.styles'

export const StyledTextArea = styled('textarea', {
  ...textFieldsStyles,
  variants: {
    ...textFieldsStyles.variants,
    mint: {
      true: {
        height: '96px',
        padding: '14px 16px',
      },
    },
  },
})
