import { Warning } from '@mui/icons-material'
import { FC, useCallback, useState } from 'react'
import { useNetwork } from 'wagmi'

import { styled } from '../../../../styles'
import { chains } from '../../../config/web3Modal'
import { Button, Popover, PopoverContent, PopoverTrigger } from '../../../UIkit'
import { AddressIcon, DisconnectButton, SwitchNetworkButton } from '../../Web3'
import { ViewMnemonicButton } from '../../Web3/ViewMnemonicButton/ViewMnemonicButton'
import { AccountButton } from './AccountButton'

const Spacer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: '$3',
})

const IconWrapper = styled('div', {
  background: '$white',
  dflex: 'center',
})

export interface AppAccountMenuProps {
  address: string
}

export const AppAccountMenu: FC<AppAccountMenuProps> = ({ address }) => {
  const [isOpen, setIsOpen] = useState(false)
  const close = useCallback(() => setIsOpen(false), [setIsOpen])
  const { chain } = useNetwork()
  const needToSwitchNetwork = chain && !(chains.find(item => item.id === chain.id))

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          icon
          secondary
          small
          iconCover
          blueBorder
        >
          <IconWrapper>
            {needToSwitchNetwork ? (
              <Warning
                sx={{
                  color: 'var(--colors-red)',
                }}
              />
            ) : (
              <AddressIcon
                address={address}
                size={36}
              />
            )}
          </IconWrapper>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Spacer>
          {needToSwitchNetwork && (
            <SwitchNetworkButton onPress={close} />
          )}
          <AccountButton address={address} onPress={close} />
          <ViewMnemonicButton />
          <DisconnectButton onPress={close} />
        </Spacer>
      </PopoverContent>
    </Popover>
  )
}
