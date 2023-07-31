import { styled } from '../../../styles'
import WelcomeBlock from './Blocks/WelcomeBlock'

const GradientWrapper = styled('div', {
  width: '100%',
  backgroundColor: '$gray100',
  overflow: 'hidden',
})

export default function MainPage() {
  return (
    <GradientWrapper>
      <WelcomeBlock />
    </GradientWrapper>
  )
}
