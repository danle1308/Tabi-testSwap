import React, { useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import { Box, Flex } from '../../../../components/Box'
import { ChevronDownIcon, MetamaskIcon } from '../../../../components/Svg'
import { UserMenuProps, variants } from './types'
// import MenuIcon from './MenuIcon'
import { UserMenuItem } from './styles'
import { Button } from '../../../../components/Button'
import { Text } from '../../../../components/Text'
import { useMatchBreakpoints } from '../../../../hooks'

export const StyledUserMenu = styled(Button).attrs({ variant: 'connect-wallet' })`
  position: relative;
  cursor: pointer;

  min-height: 42px;
  padding: 0;

  justify-content: center;
  align-items: center;
  grid-gap: 3px;

  font-weight: 700;

  box-shadow: none;
  background: transparent;

  &::before {
    content: '';
    position: absolute;
    bottom: -25px;
    width: 100%;
    height: 25px;
    background: transparent;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    box-shadow: 0px 3px 0px 0px #ffffff;
    padding: 0 16px;
    background: var(--color-red);
    grid-gap: 8px;
  }
`

export const LabelText = styled(Text)`
  font-weight: 600;
`

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: #222426;
  border-radius: 16px;
  pointer-events: auto;
  width: 280px;
  visibility: visible;
  z-index: 1001;
  padding: 4px 16px;

  &:after {
    content: '';
    width: 100%;
    height: 25px;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
  }

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}
  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;

    &:hover {
      background: transparent;
      opacity: 0.65;
    }
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;

    &:hover {
      background: transparent;
      opacity: 0.65;
    }
  }
`

const UserMenu: React.FC<
  UserMenuProps & {
    onClick?: () => void
  }
> = ({ account, text, avatarSrc, variant = variants.DEFAULT, children, onClick, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)
  const accountEllipsis = account ? `${account.substring(0, 5)}...${account.substring(account.length - 4)}` : null
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: 'absolute',
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: [0, 25] } }],
  })

  // useEffect(() => {
  //   const showDropdownMenu = () => {
  //     setIsOpen(true)
  //   }

  //   const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
  //     const target = evt.target as Node
  //     if (target && !tooltipRef?.contains(target)) {
  //       setIsOpen(false)
  //       evt.stopPropagation()
  //     }
  //   }

  //   targetRef?.addEventListener('mouseenter', showDropdownMenu)
  //   targetRef?.addEventListener('mouseleave', hideDropdownMenu)

  //   return () => {
  //     targetRef?.removeEventListener('mouseenter', showDropdownMenu)
  //     targetRef?.removeEventListener('mouseleave', hideDropdownMenu)
  //   }
  // }, [targetRef, tooltipRef, setIsOpen])

  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        // onTouchStart={() => {
        //   setIsOpen((s) => !s)
        // }}
        onClick={onClick}
      >
        <Flex
          width={[18, , 27, , 30]}
          height={[18, , 27, , 30]}
          background="var(--color-white)"
          borderRadius="50%"
          justifyContent="center"
          alignItems="center"
        >
          <MetamaskIcon width={isMobile ? '12px' : '20px'} />
        </Flex>
        {isMobile ? null : <LabelText title={text || account}>{text || accountEllipsis}</LabelText>}
        <ChevronDownIcon color="white" width={isMobile ? '14px' : '20px'} />
      </StyledUserMenu>
      <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
        <Box onClick={() => setIsOpen(false)}>{children?.({ isOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default UserMenu
