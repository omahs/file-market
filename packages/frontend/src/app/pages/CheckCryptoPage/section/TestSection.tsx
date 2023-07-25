import React from 'react'

import { Txt } from '../../../UIkit'
import { Description, TestPart } from '../CheckCryptoPage.styled'
import { ITestProps } from '../helper/types/types'
import CycleTest from '../TestBlock/CycleTest'

const TestSection = ({ items, descriptions }: { items: ITestProps[], descriptions: string[] }) => {
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

export default TestSection
