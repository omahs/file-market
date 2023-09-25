import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type FC, type PropsWithChildren } from 'react'
import { WagmiConfig } from 'wagmi'

import { DialogManager } from './app/components/DialogManager/DialogManager'
import { BlockNumberWatcher } from './app/components/Web3/BlockNumberWatcher/BlockNumberWatcher'
import { FileWalletConnectWatcher } from './app/components/Web3/FileWalletConnectWatcher'
import { wagmiConfig, Web3ModalConfigured } from './app/config/web3Modal'
import { StoreProvider } from './app/hooks'
import { StitchesProvider } from './styles'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <StitchesProvider>
          <NextUIProvider disableBaseline>
            <StoreProvider>
              {children}
              <DialogManager />
            </StoreProvider>
          </NextUIProvider>
        </StitchesProvider>
        <FileWalletConnectWatcher />
        <BlockNumberWatcher />
      </WagmiConfig>
      <Web3ModalConfigured />
    </QueryClientProvider>
  )
}
