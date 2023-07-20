import { mnemonicToEntropy } from 'bip39'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { PasswordInput } from '../../components/Form/PasswordInput/PasswordInput'
import { createMnemonic } from '../../components/Web3/ConnectFileWalletDialog/utils/createMnemonic'
import { validateImportMnemonic } from '../../components/Web3/ConnectFileWalletDialog/utils/validate'
import { Button, PageLayout } from '../../UIkit'
import { Form } from '../CreatePage/CreateCollectionPage'
import { TestContainer } from './CheckCryptoPage.styled'
import { ITestProps } from './helper/types/types'
import CycleSection from './section/CycleSection/CycleSection'
import FileSection from './section/FileSection/FileSection'

interface CheckCrypto {
  inputSeed: string
}

const CheckCryptoPage = observer(() => {
  const [playingTestsFile, setPlayingTestsFile] = useState<ITestProps[]>([])
  const [playingTestsCycle, setPlayingTestCycle] = useState<ITestProps[]>([])
  const [seed, setSeed] = useState<ArrayBuffer | undefined>()
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false)
  const [isLoadingCycle, setIsLoadingCycle] = useState<boolean>(false)
  const countIter = 10
  const { handleSubmit, control, formState: { errors }, watch } = useForm<CheckCrypto>({})
  const randomSeed = () => {
    const newMnemonic = createMnemonic()

    return Buffer.from(mnemonicToEntropy(newMnemonic), 'hex')
  }

  const render = (seedProps?: ArrayBuffer) => {
    const playTempFile: ITestProps[] = []
    const playTempCycle: ITestProps[] = []
    const seed = seedProps ?? randomSeed()
    setSeed(seed)
    for (let i = 0; i < countIter; i++) {
      playTempFile.push({
        play: false,
        seed,
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
      })
      playTempCycle.push({
        play: false,
        seed,
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
      })
    }
    setPlayingTestsFile(playTempFile)
    setPlayingTestCycle(playTempCycle)
  }

  const iterStart = useCallback((seed?: ArrayBuffer) => {
    render(seed)
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
  }, [])

  const isLoading = useMemo(() => {
    return isLoadingCycle || isLoadingFile
  }, [isLoadingCycle, isLoadingFile])

  const onSubmit: SubmitHandler<CheckCrypto> = (data) => {
    let seed
    if (!!data.inputSeed) seed = Buffer.from(mnemonicToEntropy(data.inputSeed), 'hex')
    iterStart(seed)
  }

  const inputSeed = watch('inputSeed')

  return (
    <PageLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TestContainer>
          <Button
            disabled={isLoading || (!!(errors.inputSeed) && !!inputSeed)}
            style={{
              marginBottom: '16px',
            }}
            type={'submit'}
          >
            {isLoading ? 'Loading' : (!!(errors.inputSeed) && !!inputSeed ? 'Error' : 'Start Tests')}
          </Button>
          <PasswordInput<CheckCrypto>
            inputProps={{
              isError: !!errors?.inputSeed,
              isDisabledFocusStyle: false,
              errorMessage: errors?.inputSeed?.message,
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
        </TestContainer>
      </Form>
      <TestContainer style={{ overflowX: 'auto' }}>
        <FileSection items={playingTestsFile} />
        <CycleSection items={playingTestsCycle} />
      </TestContainer>
      {seed && <TestContainer style={{ marginTop: '16px' }}>{Buffer.from(seed).toString('hex')}</TestContainer>}
    </PageLayout>

  )
})

export default CheckCryptoPage
