import React from 'react'

import { Txt } from '../../../../UIkit'
import { Description, TestPart } from '../../CheckCryptoPage.styled'
import { ITestProps } from '../../helper/types/types'
import CycleTest from '../../TestBlock/CycleTest'

const CycleSection = ({ items }: { items: ITestProps[] }) => {
  const descriptions = ['aesDerivation', 'rsaDerivation', 'rsaEncrypt', 'rsaDecrypt', 'Equal']

  return (
    <>
      {!!items.length && (
        <Description>
          <TestPart>
            {descriptions.map((item, index) => {
              return <Txt key={index}>{item}</Txt>
            })}
          </TestPart>
          {items?.map((item, index) => {
            return (
              <TestPart key={index + 3000}>
                <CycleTest {...item} />
              </TestPart>
            )
          })}
        </Description>
      )}
    </>
  )
}

export default CycleSection
