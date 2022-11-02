import { FC, PropsWithChildren } from 'react'
import { styled } from '../../../../styles'
import { Container } from '../../Container'

export type NavBarCollapseProps = PropsWithChildren<{
  isOpen?: boolean
}>

const StyledNavBarCollapse = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backdropFilter: 'blur(12.5px)',
  background: '$whiteOp75',
  width: '100%',
  height: '0px',
  zIndex: '1',
  overflow: 'hidden',
  variants: {
    isOpen: {
      true: {
        top: '$layout$navBarHeight',
        height: '100%'
      }
    }
  }
})

const StyledScrollContainer = styled('div', {
  overflowY: 'hidden', // make scroll if nav overflows
  height: '100%',
  maxHeight: '100%'
})

const StyledContent = styled('div', {
  paddingLeft: '$3',
  paddingTop: '$4',
  paddingBottom: '$layout$navBarHeight'
})

export const NavBarCollapse: FC<NavBarCollapseProps> = ({ children, isOpen }) => {
  return (
    <StyledNavBarCollapse
      isOpen={isOpen}
    >
      <StyledScrollContainer>
        <Container>
          <StyledContent>
            {children}
          </StyledContent>
        </Container>
      </StyledScrollContainer>
    </StyledNavBarCollapse>
  )
}
