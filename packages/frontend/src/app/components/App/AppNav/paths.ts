import { NavBarItemData } from '../../../UIkit'

export const paths: NavBarItemData[] = [
  {
    to: '/market/efts',
    label: 'Explore',
  },
  {
    to: 'https://medium.com/filemarket-xyz',
    label: 'Blogs',
    isLink: true,
  },
  {
    to: 'https://medium.com/filemarket-xyz/how-to-buy-fil-and-use-fil-in-the-filecoin-virtual-machine-d67fa90764d5',
    label: 'How to get FIL',
    isLink: true,
  },
  {
    to: '/market/collections',
    label: 'Collections',
  },
]

export const pathsWithoutCurrentBlockchain: string[] = [
  'branding', 'successGetAccess', 'collection', 'checkCrypto',
]
