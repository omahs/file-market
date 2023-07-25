import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'

interface SectionTitleProps {
  children: string
  marginBottom?: '32' | '40'
}

const Title = styled('h1', {
  ...textVariant('fourfold1').true,
  color: '$gray700',
  '@lg': {
    fontSize: 'calc(1.5vw + 30px)',
  },
  variants: {
    marginBottom: {
      32: {
        marginBottom: '$4',
        '@lg': {
          marginBottom: 'calc(1.5vw + 15px)',
        },
      },
      40: {
        marginBottom: '$5',
      },
    },
  },
})

const SectionTitle = (props: SectionTitleProps) => {
  return (
    <Title marginBottom="32">{props.children}</Title>
  )
}

export default SectionTitle
