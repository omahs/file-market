import { Navigate, type RouteObject } from 'react-router-dom'

import CreateCollectionPage from './Collection/CreateCollectionPage'
import CreateNFTPage from './EFT/CreateNFTPage'

export const createRoutes: RouteObject[] = [
  {
    path: 'eft',
    element: <CreateNFTPage />,
  },
  {
    path: 'collection',
    element: <CreateCollectionPage />,
  },
  {
    path: '',
    element: <Navigate replace to={'eft'} />,
  },
]
