import React from 'react'

import MultiChainController from '../../../components/MultiChain/Controller/MultiChainController/MultiChainController'
import CreateCollectionSection from './sections/CreateCollection/CreateCollectionSection'

export default function CreateCollectionPage() {
  return <MultiChainController renderElem={<CreateCollectionSection />} />
}
