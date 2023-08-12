// @ts-expect-error
import ConvertKitForm from 'convertkit-react'
import React from 'react'

import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'
import CirclesImgSrc from '../../img/KeepTouch/Circles.svg'
import GridImgSrc from '../../img/KeepTouch/Grid.svg'

const ConvertKitStyle = styled(ConvertKitForm, {
  background: 'white',
  borderRadius: '16px',
  gap: '10px',
  display: 'flex',
  justifyContent: 'center',
  '@lg': {
    '& > *': {
      flexGrow: 1,
    },
  },
  '@md': {
    width: '100%',
  },
  '& input': {
    width: '400px',
    height: '48px',
    border: '1px solid #232528',
    filter: 'drop-shadow(0px 4px 20px rgba(35, 37, 40, 0.05))',
    borderRadius: '16px',
    padding: '8px 16px',
    color: '#232528',
    ...textVariant('primary1').true,
    fontWeight: '400',
    '@md': {
      width: '100%',
    },
    '@sm': {
      width: '100%',
      margin: '0 auto',
    },
  },
  '& button': {
    cursor: 'pointer',
    ...textVariant('primary1').true,
    border: '2px solid #028FFF',
    borderRadius: '12px',
    color: '#028FFF',
    width: '160px',
    height: '48px',
    background: 'linear-gradient(to bottom, $white 50%, #028FFF 50%)',
    backgroundSize: '100% 200%',
    backgroundPosition: '0 0%',
    transition: 'background-position 0.3s ease-out, color 0.3s ease-out',
    '&:hover': {
      color: '$white',
      backgroundPosition: '0 100%',
    },
    '@md': {
      width: '30%',
    },
    '@sm': {
      width: '100%',
      margin: '0 auto',
    },
  },
  '& #ck-first-name': {
    display: 'none',
  },
  '@sm': {
    flexDirection: 'column',
  },
})

const Title = styled('h3', {
  ...textVariant('primary1').true,
  fontWeight: '600',
  fontSize: '$ternary2',
  color: 'gray700',
  '@lg': {
    textAlign: 'center',
  },
  '@md': {
    fontSize: '24px',
  },
  '@sm': {
    textAlign: 'left',
  },
})

const EmailContainer = styled('div', {
  position: 'relative',
  width: '100%',
})

const EmailContainerInner = styled('div', {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  padding: '32px',
  borderRadius: '16px',
  border: '2px solid #6B6F76',
  background: 'white',
  '@lg': {
    flexDirection: 'column',
    rowGap: '24px',
    alignItems: 'stretch',
  },
  '@md': {
    flexDirection: 'column',
  },
  '@sm': {
    padding: '24px',
  },
  '@xs': {
    padding: '16px',
  },
})

const GridImg = styled('img', {
  position: 'absolute',
  zIndex: 1,
  top: '50%',
  right: '-4.2%',
  transform: 'translateY(-50%)',
  '@xl': {
    right: '-6.2%',
  },
  '@lg': {
    right: '-8.2%',
  },
  '@md': {
    width: '440px',
    right: '-10.2%',
  },
  '@sm': {
    width: '518px',
    top: 'auto',
    left: '50%',
    bottom: '-107px',
    transform: 'translateX(-50%)',
  },
})

const CirclesImg = styled('img', {
  position: 'absolute',
  zIndex: 1,
  top: '50%',
  left: '-8%',
  transform: 'translateY(-50%)',
  '@xl': {
    left: '-11.5%',
  },
  '@lg': {
    left: '-14.5%',
    width: '240px',
  },
  '@md': {
    left: '-16%',
    width: '200px',
  },
  '@sm': {
    width: '256px',
    top: '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
})

const EmailForm = () => {
  return (
    <EmailContainer>
      <CirclesImg src={CirclesImgSrc} />
      <EmailContainerInner>
        <Title>Keep in touch</Title>
        <ConvertKitStyle
          formId={5117091}
          submitText={'Get News'}
          emailPlaceholder={'Enter Email'}
        />
      </EmailContainerInner>
      <GridImg src={GridImgSrc} />
    </EmailContainer>
  )
}

export default EmailForm
