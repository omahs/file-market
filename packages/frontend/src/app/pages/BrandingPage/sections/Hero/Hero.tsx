import heroLogoSrc from '../../../../../assets/img/BrandingPage/hero-logo.svg'
import { styled } from '../../../../../styles'
import { Txt } from '../../../../UIkit'

const HeroWrapper = styled('section', {
  position: 'relative',
  paddingTop: '53px',
  paddingBottom: '53px',
  marginBottom: '250px',
  '@xl': {
    marginBottom: '80px',
  },
  '@lg': {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  '@sm': {
    paddingTop: '40px',
  },
})

const HeroTextWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  rowGap: '16px',
  color: '$gray700',
  zIndex: '2',
  '@media (max-width: 1600px)': {
    maxWidth: 800,
  },
  '@xl': {
    maxWidth: 700,
  },
  '@lg': {
    maxWidth: 500,
    paddingRight: 70,
  },
  '@md': {
    maxWidth: '100%',
    paddingRight: 0,
    br: {
      display: 'none',
    },
  },
})

const HeroTitle = styled('h1', {
  position: 'relative',
  zIndex: '2',
  color: '$gray700',
  fontFamily: '$fourfold',
  fontSize: '3.5rem',
  fontWeight: '$fourfold',
  lineHeight: '1',
  marginBottom: '48px',
  '@md': {
    fontSize: '3rem',
  },
  '@sm': {
    fontSize: '2.5rem',
  },
})

const HeroLogo = styled('img', {
  position: 'absolute',
  right: '0%',
  top: '0',
  width: '500px',
  height: '500px',
  zIndex: '1',
  '@xl': {
    height: '100%',
    width: 'auto',
  },
  '@md': {
    right: '10%',
    height: '160px',
    width: '160px',
  },
  '@sm': {
    right: '5%',
  },
  '@xs': {
    right: '0',
  },
})

export default function Hero() {
  return (
    <HeroWrapper>
      <HeroTitle>
        Branding &
        <br />
        Media kit
      </HeroTitle>
      <HeroTextWrapper>
        <Txt body2>
          Welcome to FileMarket&apos;s Branding Page!
        </Txt>
        <Txt body2>
          Discover our logos, guidelines, and corporate styles here, all designed to ensure brand consistency.
        </Txt>
        <Txt body2>
          Use these resources wisely to accurately represent our brands.
        </Txt>
      </HeroTextWrapper>
      <HeroLogo src={heroLogoSrc} />
    </HeroWrapper>
  )
}
