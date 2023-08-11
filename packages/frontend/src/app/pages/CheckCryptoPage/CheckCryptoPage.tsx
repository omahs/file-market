import { mnemonicToEntropy } from 'bip39'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

import { PasswordInput } from '../../components/Form/PasswordInput/PasswordInput'
import { createMnemonic } from '../../components/Web3/ConnectFileWalletDialog/utils/createMnemonic'
import {
  validateCollectionAddress,
  validateImportMnemonic,
} from '../../components/Web3/ConnectFileWalletDialog/utils/validate'
import { useAuth } from '../../hooks/useAuth'
import { Button, Input, PageLayout } from '../../UIkit'
import { Form } from '../CreatePage/helper/style/style'
import { TestContainer } from './CheckCryptoPage.styled'
import { ITestProps } from './helper/types/types'
import CycleSection from './section/CycleSection/CycleSection'
import FileSection from './section/FileSection/FileSection'

interface CheckCrypto {
  inputSeed: string
  collectionAddress: string
}

const CheckCryptoPage = observer(() => {
  const [playingTestsFile, setPlayingTestsFile] = useState<ITestProps[]>([])
  const [playingTestsCycle, setPlayingTestCycle] = useState<ITestProps[]>([])
  const { isConnected, address } = useAccount()
  const [seed, setSeed] = useState<ArrayBuffer | undefined>()
  const [collectionAddress, setCollectionAddress] = useState<string | undefined>()
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false)
  const [isLoadingCycle, setIsLoadingCycle] = useState<boolean>(false)
  const [isVisibleCustom, setIsVisibleCustom] = useState<boolean>(false)
  const countIter = 6
  const { handleSubmit, control, formState: { errors }, watch } = useForm<CheckCrypto>({})
  const randomSeed = () => {
    const newMnemonic = createMnemonic()

    return Buffer.from(mnemonicToEntropy(newMnemonic), 'hex')
  }

  const { connect } = useAuth()

  const render = (seedProps?: ArrayBuffer, collectionAddressProps?: string) => {
    const playTempFile: ITestProps[] = []
    const playTempCycle: ITestProps[] = []
    const seed = seedProps ?? randomSeed()
    const collectionAddress = collectionAddressProps ?? address
    setSeed(seed)
    setCollectionAddress(collectionAddress)
    for (let i = 0; i < countIter; i++) {
      playTempFile.push({
        play: false,
        seed,
        collectionAddress,
        onTestEnd: () => {
          setPlayingTestsFile(prevState => {
            const temp = [...prevState]
            if (i < countIter - 1) {
              temp.splice(i + 1, 1, {
                ...temp[i + 1],
                play: true,
              })
            } else {
              setIsLoadingFile(false)
            }

            return temp
          })
        },
        iterNumber: i,
      })
      playTempCycle.push({
        play: false,
        seed,
        collectionAddress,
        onTestEnd: () => {
          setPlayingTestCycle(prevState => {
            const temp = [...prevState]
            if (i < countIter - 1) {
              temp.splice(i + 1, 1, {
                ...temp[i + 1],
                play: true,
              })
            } else {
              setIsLoadingCycle(false)
            }

            return temp
          })
        },
        iterNumber: i,
      })
    }
    setPlayingTestsFile(playTempFile)
    setPlayingTestCycle(playTempCycle)
  }

  const iterStart = useCallback((seed?: ArrayBuffer, collectionAddress?: string) => {
    if (!isConnected) {
      connect()

      return
    }
    render(seed, collectionAddress)
    setIsLoadingCycle(true)
    setIsLoadingFile(true)
    setPlayingTestsFile(prevState => {
      const temp = [...prevState]
      temp.splice(0, 1, {
        ...temp[0],
        play: true,
      })

      return temp
    })
    setPlayingTestCycle(prevState => {
      const temp = [...prevState]
      temp.splice(0, 1, {
        ...temp[0],
        play: true,
      })

      return temp
    })
  }, [isConnected])

  const isLoading = useMemo(() => {
    return isLoadingCycle || isLoadingFile
  }, [isLoadingCycle, isLoadingFile])

  const onSubmit: SubmitHandler<CheckCrypto> = (data) => {
    let seed
    let collectionAddress
    if (!!data.inputSeed && isVisibleCustom) seed = Buffer.from(mnemonicToEntropy(data.inputSeed), 'hex')
    if (!!data.collectionAddress && isVisibleCustom) collectionAddress = data.collectionAddress
    iterStart(seed, collectionAddress)
  }

  const inputSeed = watch('inputSeed')
  const collectionAddressInput = watch('collectionAddress')

  const isError = useMemo(() => {
    return ((!!(errors.inputSeed) && !!inputSeed) || (!!(errors.collectionAddress) && !!collectionAddressInput)) && isVisibleCustom
  }, [inputSeed, errors, collectionAddressInput, isVisibleCustom])

  return (
    <PageLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TestContainer>
          <Button
            disabled={isLoading || isError}
            style={{
              marginBottom: '16px',
            }}
            type={'submit'}
          >
            {isLoading ? 'Loading' : (isError ? 'Error' : 'Start Tests')}
          </Button>
          <input style={{ opacity: '0' }} type={'checkbox'} onChange={() => { setIsVisibleCustom(prevState => !prevState) }} />
          {isVisibleCustom && (
            <>
              <PasswordInput<CheckCrypto>
                inputProps={{
                  isError: !!errors?.inputSeed,
                  isDisabledFocusStyle: false,
                  errorMessage: errors?.inputSeed?.message,
                  placeholder: 'Enter seed phrase',
                }}
                controlledInputProps={{
                  name: 'inputSeed',
                  control,
                  rules: {
                    validate: (p) => {
                      if (!!validateImportMnemonic(p) && !!p) return validateImportMnemonic(p)
                    },
                  },
                }}
              />
              <Input<CheckCrypto>
                isError={!!errors?.inputSeed}
                isDisabledFocusStyle={false}
                errorMessage={errors?.inputSeed?.message}
                placeholder={'Enter collection address'}
                controlledInputProps={{
                  name: 'collectionAddress',
                  control,
                  rules: {
                    validate: (p) => {
                      if (!!validateCollectionAddress(p) && !!p) return validateCollectionAddress(p)
                    },
                  },
                }}
              />
            </>
          )}
        </TestContainer>
      </Form>
      <TestContainer style={{ overflowX: 'auto' }}>
        <FileSection items={playingTestsFile} />
        <CycleSection items={playingTestsCycle} />
      </TestContainer>
      {seed && <TestContainer style={{ marginTop: '16px' }}>{Buffer.from(seed).toString('hex')}</TestContainer>}
      {collectionAddress && <TestContainer style={{ marginTop: '16px' }}>{collectionAddress}</TestContainer>}
    </PageLayout>

  )
})

export default CheckCryptoPage
