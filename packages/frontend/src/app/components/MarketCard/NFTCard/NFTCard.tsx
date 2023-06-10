import React from 'react'

import { HiddenFileMetaData } from '../../../../swagger/Api'
import { NftCardBase, NftCardUserInfo, PriceBadge } from '../../../UIkit'
import { formatCurrency, formatUsd } from '../../../utils/web3'
import { FileType } from '../FileType/FileType'

export interface NFTCardProps {
  imageURL: string
  title: string
  collectionName: string
  user: {
    img: string
    address: string
  }
  button: {
    text: string
    link: string
  }
  priceUsd?: string
  price?: string
  hiddenFileMeta?: HiddenFileMetaData
}

export const NFTCard: React.FC<NFTCardProps> = ({
  collectionName,
  button,
  imageURL,
  hiddenFileMeta,
  title,
  user,
  price,
  priceUsd,
}) => {
  return (
    <NftCardBase
      to={button.link}
      title={title}
      collectionName={collectionName}
      fileType={<FileType hiddenFileMeta={hiddenFileMeta} />}
      imgSrc={imageURL}
      button={{
        to: button.link,
        text: button.text,
      }}
    >
      <NftCardUserInfo img={user.img} address={user.address} />
      {price && (
        <PriceBadge
          left={formatCurrency(price ?? 0)}
          right={priceUsd && `~${formatUsd(priceUsd ?? 0)}`}
        />
      )}
    </NftCardBase>
  )
}
