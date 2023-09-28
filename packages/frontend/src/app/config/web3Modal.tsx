import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { Buffer } from 'buffer'
import { type FC } from 'react'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import multichainConfig from '../../../../../config/multiChainConfig.json'
import { theme } from '../../styles'
import { type IMultiChainConfig } from './multiChainConfigType'

export const chainsDefault = (JSON.parse(JSON.stringify(multichainConfig)) as IMultiChainConfig[])
  .map(item => item.chain)
  .filter(item => {
    return (item.testnet === true) === !import.meta.env.VITE_IS_MAINNET
  })

export const { chains } = configureChains(
  chainsDefault,
  [
    publicProvider(),
    publicProvider(),
    publicProvider(),
  ],
  { pollingInterval: 10_000 },
)

if (!window.Buffer) {
  window.Buffer = Buffer
}

(window as any).global = window

export const projectId = import.meta.env.VITE_WEB3_MODAL_PROJECT_ID

if (!projectId) {
  throw new Error('You need to provide VITE_WEB3_MODAL_PROJECT_ID env variable')
}

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

// Montserrat, sans-serif
export const Web3ModalConfigured: FC = () => (
  <Web3Modal
    projectId={projectId}
    themeMode="light"
    ethereumClient={ethereumClient}
    themeVariables={{
      '--w3m-font-family': theme.fonts.primary.value,
      '--w3m-accent-color': theme.colors.blue500.value,
      '--w3m-z-index': '9999',
    }}
  />
)
