import { Tooltip } from '@nextui-org/react'
import React, { FC, PropsWithChildren } from 'react'

import Protected from '../../../../assets/img/Protected.svg'
import QuestionMark from '../../../../assets/img/QuestionMark.svg'
import { styled } from '../../../../styles'
import { Button } from '../../../UIkit'

const LayoutStyled = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$3',
  '& .buttons button': {
    color: '$blue500',
    padding: '0 8px',
    width: '368px',
    height: '56px',
    background: 'linear-gradient(89.63deg, rgba(225, 75, 236, 0.1) -0.08%, rgba(16, 55, 158, 0.1) 47.36%, rgba(0, 220, 255, 0.1) 100%)',
    borderRadius: '16px',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: '600',
      background: 'linear-gradient(89.63deg, #864AD3 -0.08%, #10379E 47.36%, #4160ED 100%)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      '& .firstImg': {
        paddingRight: '8px'
      },
      '& .secondImg': {
        paddingLeft: '4px'
      }
    }
  },
  '@md': {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    '& .buttons': {
      width: '100%',
      '& button': {
        width: '100%',
        '& span': {
          fontSize: '12px',
          '& .firstImg': {
            width: '60px'
          }
        }
      }
    },
    '& .tooltip': {
      width: '100% !important'
    }
  }
})

export const ProtectedStamp: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LayoutStyled>
      {children}
      <Tooltip content={'Allows users to mint NFTs with attached encrypted files of any size stored on Filecoin, which can only be accessed exclusively by the owner of the NFT.'}
               rounded color="primary" className={'tooltip'}>
        <div className="buttons">
          <Button className={'buttons'}><span><img src={Protected} className={'firstImg'} />Protected by EFT techology <img src={QuestionMark} className={'secondImg'} /></span></Button>
        </div>
      </Tooltip>
    </LayoutStyled>
  )
}
