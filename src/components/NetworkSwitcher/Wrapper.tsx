import { Box, ChevronDownIcon, Flex, UserMenuItem, UserMenuProps } from 'packages/uikit'
import React, { useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  background-color: transparent;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  height: 48px;
  gap: 5px;
  position: relative;
  padding: 12px 16px;

  ${({ theme }) => theme.mediaQueries.xs} {
    border: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    border: 1px solid rgb(255, 101, 15);
  }

  &:hover {
    opacity: 0.65;
  }
`

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.textActive};
  display: none;
  font-weight: 500;
  font-size: 18px;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    padding: 20px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    padding: 0 20px;
  }
`

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.backgroundActive};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  width: 180px;
  visibility: visible;
  z-index: 1001;

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

const Wrapper: React.FC<UserMenuProps> = ({ account, text, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: 'fixed',
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
  })

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true)
    }

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false)
        evt.stopPropagation()
      }
    }

    targetRef?.addEventListener('mouseenter', showDropdownMenu)
    targetRef?.addEventListener('mouseleave', hideDropdownMenu)

    return () => {
      targetRef?.removeEventListener('mouseenter', showDropdownMenu)
      targetRef?.removeEventListener('mouseleave', hideDropdownMenu)
    }
  }, [targetRef, tooltipRef, setIsOpen])

  return (
    <Flex style={{ gap: '10px' }} alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        onTouchStart={() => {
          setIsOpen((s) => !s)
        }}
      >
        <img width={30} src="/images/logo.png" alt="" />
        <LabelText title={text || account}>{text || accountEllipsis}</LabelText>
      </StyledUserMenu>
      <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={false}>
        <Box onClick={() => setIsOpen(false)}>{children?.({ isOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default Wrapper
