import React from 'react'

import MultiChainController from '../../../components/MultiChain/Controller/MultiChainController/MultiChainController'
import { CreateEFTSection } from './sections/CreateEFT/CreateEFTSection'

const CreateNftPage = () => {
  return <MultiChainController type={'eft'} renderElem={<CreateEFTSection />} />
}

export default CreateNftPage
