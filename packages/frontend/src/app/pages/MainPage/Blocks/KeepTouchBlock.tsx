import { styled } from '../../../../styles'
import EmailForm from '../components/EmailForm/EmailForm'

const KeepTouchBlockStyled = styled('div', {
  width: '100%',
  marginTop: '160px',
  '@lg': {
    marginTop: '140px',
  },
  '@md': {
    marginTop: '130px',
  },
  '@sm': {
    marginTop: '140px',
  },
})

const KeepTouchBlock = () => {
  return (
    <KeepTouchBlockStyled>
      <EmailForm />
    </KeepTouchBlockStyled>
  )
}

export default KeepTouchBlock
