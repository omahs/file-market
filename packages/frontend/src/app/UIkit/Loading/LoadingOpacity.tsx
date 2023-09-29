import { Loading as LoadingNextUI } from '@nextui-org/react'
import React, { type PropsWithChildren, useMemo } from 'react'

import { styled } from '../../../styles'
import { Flex } from '../Flex'

const LoadingContainer = styled(Flex, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
})

const Loading = styled(LoadingNextUI, {
  position: 'absolute',
})

const LoadingChildren = styled('div', {
  opacity: '1',
  variants: {
    isLoading: {
      true: {
        opacity: '0',
      },
    },
  },
})

interface LoadingProps extends PropsWithChildren {
  isLoading: boolean
}

export const LoadingOpacity: React.FC<LoadingProps> = ({ isLoading, children }) => {
  const LoadingChildrenElem = useMemo(() => {
    return isLoading ? LoadingChildren : React.Fragment
  }, [isLoading])

  const LoadingContainerElem = useMemo(() => {
    return isLoading ? LoadingContainer : React.Fragment
  }, [isLoading])

  const loadingContainerProps = useMemo(() => {
    return isLoading ? {
      h100: true,
      w100: true,
      justifyContent: 'center',
      css: { minHeight: 24 },
    } : undefined
  }, [isLoading])

  const loadingChildrenProps = useMemo(() => {
    return isLoading ? {
      isLoading,
    } : undefined
  }, [isLoading])

  return (
    <LoadingContainerElem
      {...loadingContainerProps}
    >
      {isLoading && <Loading type="points" size='lg' />}
      <LoadingChildrenElem {...loadingChildrenProps}>{children}</LoadingChildrenElem>
    </LoadingContainerElem>
  )
}
