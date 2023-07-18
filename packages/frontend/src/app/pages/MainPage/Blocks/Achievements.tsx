import { styled } from '../../../../styles'
import BoxShadowed from '../components/BoxShadowed/BoxShadowed'
import Title from '../components/SectionTitle/SectionTitle'
import { AchievementsData } from '../helper/Achievements/data'

export interface AchievementItemProps {
  img: string
  title: React.ReactNode
  description?: string
  href?: string
}

const AchievementItemLink = styled('a', {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  columnGap: '12px',
  backgroundColor: '$white',
  padding: '$3',
  '@sm': {
    padding: '$3',
  },
  '&[href]:hover': {
    h4: {
      color: '$blue500',
    },
  },
})

const AchievementItemIcon = styled('img', {
  display: 'block',
  width: '65px',
  height: 'auto',
})

const AchievementItemTitle = styled('h4', {
  fontSize: '$body4',
  lineHeight: '$body2',
  fontWeight: '$primary',
  color: '$gray700',
  transition: 'all 0.2s ease-in-out',
  '& + p': {
    marginTop: '8px',
  },
})

const AchievementItemDescr = styled('p', {
  fontSize: '$primary2',
  lineHeight: '1.1',
  color: '$gray700',
})

const AchievementItem = (props: AchievementItemProps) => {
  return (
    <BoxShadowed fullHeight>
      <AchievementItemLink href={props.href} target="_blank">
        <AchievementItemIcon src={props.img} />
        <div>
          <AchievementItemTitle>{props.title}</AchievementItemTitle>
          {props.description && <AchievementItemDescr>{props.description}</AchievementItemDescr>}
        </div>
      </AchievementItemLink>
    </BoxShadowed>
  )
}

const AchievementsSection = styled('section', {
  marginBottom: '100px',
  '@lg': {
    marginBottom: '80px',
  },
  '@md': {
    marginBottom: '70px',
  },
  '@sm': {
    marginBottom: '60px',
  },
  '@xs': {
    marginBottom: '50px',
  },
})

const AchievementsList = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  columnGap: '32px',
  rowGap: '32px',
  '@md': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: '26px',
    rowGap: '26px',
  },
  '@sm': {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '18px',
  },
})

const Achievements = () => {
  return (
    <AchievementsSection>
      <Title marginBottom="32">Achievements</Title>
      <AchievementsList>
        {AchievementsData.map((item, index) => (
          <AchievementItem {...item} key={index} />
        ))}
      </AchievementsList>
    </AchievementsSection>
  )
}

export default Achievements
