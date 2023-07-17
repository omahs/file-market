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
      width: '70%',
    },
    '@sm': {
      width: '80%',
      margin: '0 auto',
    },
  },
  '& button': {
    cursor: 'pointer',
    background: 'none',
    ...textVariant('primary1').true,
    border: '2px solid #028FFF',
    borderRadius: '12px',
    color: '#028FFF',
    width: '160px',
    height: '48px',
    '@md': {
      width: '30%',
    },
    '@sm': {
      width: '80%',
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
  '@md': {
    fontSize: '24px',
  },
  '@sm': {
    fontSize: '16px',
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
  '@md': {
    gap: '12px',
    padding: '16px',
    flexDirection: 'column',
  },
})

const GridImg = styled('img', {
  position: 'absolute',
  zIndex: 1,
  top: '50%',
  right: '-4.2%',
  transform: 'translateY(-50%)',
  '@md': {
    display: 'none',
  },
})

const CirclesImg = styled('img', {
  position: 'absolute',
  zIndex: 1,
  top: '50%',
  left: '-6.85%',
  transform: 'translateY(-50%)',
  '@md': {
    display: 'none',
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
          submitText={'Get Access'}
          emailPlaceholder={'Email'}
        />
      </EmailContainerInner>
      <GridImg src={ GridImgSrc} />
    </EmailContainer>
  )
}

export default EmailForm
