import { Navigate, type RouteObject } from 'react-router-dom'

import CollectionSection from './section/Collection/CollectionSection'
import NftSection from './section/Nft/NftSection'

export const marketRoutes: RouteObject[] = [
  {
    path: '',
    element: <Navigate replace to={'efts'} />,
  },
  {
    path: 'efts',
    element: <NftSection />,
  },
  {
    path: 'collections',
    element: <CollectionSection />,
  },
  // {
  //   path: 'creators',
  //   element: <CreatorSection />,
  // },
  // {
  //   path: 'namespaces',
  //   element: <NamespaceSection />,
  //  },
]
