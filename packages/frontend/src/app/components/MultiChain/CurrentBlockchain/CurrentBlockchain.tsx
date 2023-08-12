
import gsap from 'gsap'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'

import { useMediaMui } from '../../../hooks/useMediaMui'
import { ICurrentBlockchain } from '../helper/types/currentBlockChainTypes'
import CurrentBlockchainBigScreen from './BigScreen/CurrentBlockchainBigScreen'
import { CurrentBlockchainContainer } from './CurrentBlockchain.styles'
import CurrentBlockchainMobile from './Mobile/CurrentBlockChainModile'

const CurrentBlockchain = observer((props: ICurrentBlockchain) => {
  const currentBlockchainContainerRef = useRef<HTMLDivElement>(null)
  const { mdValue } = useMediaMui()

  useEffect(() => {
    if (!currentBlockchainContainerRef.current) return

    const blockHeight = currentBlockchainContainerRef.current.clientHeight

    const ctx = gsap.context(() => {
      if (props.isVisible) {
        const tl = gsap.timeline()
        tl.fromTo(currentBlockchainContainerRef.current, { autoAlpha: 0, marginBottom: `-${blockHeight}` }, { marginBottom: '0', duration: 0.3 }).to(currentBlockchainContainerRef.current, { autoAlpha: 1, duration: 0.3 })
      } else if (!props.isVisible) {
        const tl = gsap.timeline()
        tl.fromTo(currentBlockchainContainerRef.current, { autoAlpha: 1, marginBottom: '0' }, { autoAlpha: 0, duration: 0.3 }).to(currentBlockchainContainerRef.current, { marginBottom: `-${blockHeight}`, duration: 0.3 })
      }
    })

    return () => {
      ctx.kill()
    }
  }, [props.isVisible, currentBlockchainContainerRef])

  return (
    <CurrentBlockchainContainer isBorderDisabled={props.isLight} ref={currentBlockchainContainerRef}>
      {mdValue ? <CurrentBlockchainMobile {...props} /> : <CurrentBlockchainBigScreen {...props} />}
    </CurrentBlockchainContainer>
  )
})

export default CurrentBlockchain
