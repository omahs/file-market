import React from 'react'

import { styled } from '../../../../styles'
import { supportedByData } from '../helper/SupportedBy/data'

const SupportedByStyle = styled('div', {
  marginTop: '64px',
  marginBottom: '150px',
  '@lg': {
    marginBottom: '120px',
  },
  '@md': {
    width: '100%',
    marginTop: '52px',
    marginBottom: '100px',
  },
  '@sm': {
    marginBottom: '90px',
  },
  '@xs': {
    marginTop: '48px',
    marginBottom: '80px',
  },
})

const SupportedContainerBlocks = styled('div', {
  display: 'inline-flex',
  columnGap: '48px',
  '@xl': {
    columnGap: '42px',
  },
  '@lg': {
    columnGap: '36px',
  },
  '@md': {
    columnGap: '28px',
  },
  '@sm': {
    columnGap: '22px',
  },
  '@xs': {
    columnGap: '16px',
  },
})

const SupportedByLink = styled('a', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '80px',
  height: '80px',
  '@lg': {
    width: '65px',
    height: '65px',
  },
  '@md': {
    width: '58px',
    height: '58px',
  },
  '@sm': {
    width: '52px',
    height: '52px',
  },
  '@xs': {
    width: '48px',
    height: '48px',
  },
})

const SupportedByImg = styled('img', {
  height: '100%',
  width: 'auto',
})

const SupportedByTitle = styled('h4', {
  fontFamily: '$body',
  display: 'block',
  lineHeight: 1,
  marginBottom: '24px',
  fontSize: '24px',
  fontWeight: 700,
  '@md': {
    marginBottom: '20px',
  },
  '@sm': {
    fontSize: '20px',
    marginBottom: '20px',
  },
  '@xs': {
    marginBottom: '16px',
  },
})

const SupportedBy = () => {
  return (
    <SupportedByStyle>
      <SupportedByTitle>Supported By</SupportedByTitle>
      <SupportedContainerBlocks>
        {supportedByData.map((item, index) => {
          return (
            <SupportedByLink
              key={index}
              href={item.url}
              target={'_blank'}
              rel="noreferrer"
            >
              <SupportedByImg src={item.src} />
            </SupportedByLink>
          )
        })}
      </SupportedContainerBlocks>
    </SupportedByStyle>
  )
}

export default SupportedBy
