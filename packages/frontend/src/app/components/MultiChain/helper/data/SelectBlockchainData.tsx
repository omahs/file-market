import { type ReactNode } from 'react'

export type selectBlockchainType = 'collection' | 'eft'

export const selectBlockchainTitle: Record<selectBlockchainType, ReactNode> = {
  collection: <>
    Choose Blockchain
    <br />
    {' '}
    for your EFT Collection
  </>,
  eft: 'Choose Blockchain for your EFT',
}

export const selectBlockchainDescription: Record<selectBlockchainType, ReactNode> = {
  collection: 'Your EFT Collection will be created in the selected blockchain network. ' +
    'You will need to connect the selected network ' +
    'in your wallet and have some native tokens to pay for transactions fees.',
  eft: 'Your EFT will be created in the selected blockchain network.' +
    ' You will need to connect the selected network' +
    ' in your wallet and have some native tokens to pay for transactions fees.',
}
