import { styled } from '../../../../styles'
import EmailForm from '../components/EmailForm/EmailForm'

const KeepTouchBlockStyled = styled('div', {
  width: '100%',
  marginTop: '196px',
})

const KeepTouchBlock = () => {
  return (
    <KeepTouchBlockStyled>
      <EmailForm />
    </KeepTouchBlockStyled>
  )
}

export default KeepTouchBlock
