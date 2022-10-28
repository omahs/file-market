import ToolsBlock from './Blocks/ToolsBlock'
import WelcomeBlock from './Blocks/WelcomeBlock'
import gradient from './img/Gradient.jpg'
import { styled } from '../../../styles'
import ExplorerBlock from './Blocks/ExplorerBlock'

const GradientWrapper = styled('div', {
  backgroundImage: `url(${gradient})`,
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-y'
})

export default function MainPage() {
  return (
    <GradientWrapper>
      <WelcomeBlock />
      <ToolsBlock />
      <ExplorerBlock />
    </GradientWrapper>
  )
}