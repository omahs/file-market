import { Navigate, RouteObject } from 'react-router-dom'

import CreatorSection from '../MarketPage/section/Creator/CreatorSection'
import NftSection from './sections/NftSection'

export const collectionPageRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate replace to={'efts'} />,
  },
  {
    path: 'efts',
    element: <NftSection />,
  },
  {
    path: 'owners',
    element: <CreatorSection />,
  },
  // TODO CREATE HISTORY SECTION
  {
    path: 'History',
    element: <Navigate replace to={'../efts'} />,
  },
]
