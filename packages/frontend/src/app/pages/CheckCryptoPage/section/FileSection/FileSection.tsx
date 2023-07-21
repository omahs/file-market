import React from 'react'

import { Txt } from '../../../../UIkit'
import { Description, TestPart } from '../../CheckCryptoPage.styled'
import { ITestProps } from '../../helper/types/types'
import FileTest from '../../TestBlock/FileTest'

const FileSection = ({ items }: { items: ITestProps[] }) => {
  const descriptions = ['aesDerivation', 'aesEncrypt', 'aesDecrypt', 'Equal']

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
                <FileTest {...item} iterNumber={index} />
              </TestPart>
            )
          })}
        </Description>
      )}
    </>
  )
}

export default FileSection
