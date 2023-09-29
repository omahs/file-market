import { styled } from '../../../styles'
import { SwitchButton, SwitchWrapper } from '../../components/Switch/Switch'

export const SwitchWrapperTabs = styled(SwitchWrapper, {
  position: 'relative',
  zIndex: '1',
  variants: {
    small: {
      true: {
        padding: 4,
      },
    },
    transparent: {
      true: {
        backgroundColor: 'transparent',
      },
    },
  },
})

export const StyledAmount = styled(SwitchButton, {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  textAlign: 'right',
  left: '-68px',
  paddingLeft: 84,
  borderColor: '#EAEAEC',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeft: 0,
  color: '#898E94',
  cursor: 'default',
  variants: {
    small: {
      true: {
        padding: 0,
        left: '-58px',

        paddingLeft: 70,
        paddingRight: 24,
        '@sm': {
          left: '-56px',
          paddingLeft: 68,
          paddingRight: 20,
        },
      },
    },
    transparent: {
      true: {
        backgroundColor: 'transparent',
      },
    },
  },
  '&:hover': {
    borderColor: '#EAEAEC',
  },
})
