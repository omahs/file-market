
import { styled } from '../../../styles'
import { SwitchButton, SwitchWrapper } from '../../components/Switch/Switch'

export const SwitchWrapperTabs = styled(SwitchWrapper, {
  position: 'relative',
  zIndex: '1',
})

export const StyledAmount = styled(SwitchButton, {
  textAlign: 'right',
  position: 'absolute',
  borderColor: '#EAEAEC',
  right: '-140px',
  top: '0',
  height: '100%',
  width: '245px',
  color: '#898E94',
  cursor: 'default',
  '&:hover': {
    borderColor: '#EAEAEC',
  },
  '@sm': {
    width: '200px',
    right: '-110px',
  },
})
