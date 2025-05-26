/* eslint-disable react/no-array-index-key */
import React, { createElement, useContext, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import { useMatchBreakpoints, useOnClickOutside } from '../../hooks'
import { MenuContext } from '../../widgets/Menu/context'
import { Box, Flex } from '../Box'
import { LogoutIcon } from '../Svg'
import {
  DropdownMenuDivider,
  DropdownMenuItem,
  StyledDropdownMenu,
  LinkStatus,
  StyledDropdownMenuItemContainer,
} from './styles'
import { DropdownMenuItemType, DropdownMenuProps } from './types'
import { Text } from '../Text'

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  isBottomNav = false,
  showItemsOnMobile = false,
  activeItem = '',
  items = [],
  index,
  setMenuOpenByIndex,
  handleCloseMenu,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext)
  const { isMobile } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)
  const hasItems = items.length > 0
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: isBottomNav ? 'absolute' : 'absolute',
    placement: isBottomNav ? 'bottom-start' : 'bottom-start',
    modifiers: [{ name: 'offset', options: { offset: isMobile ? [-120, -18] : [0, 0] } }],
  })

  const isMenuShow = isOpen && ((isBottomNav && showItemsOnMobile) || !isBottomNav)

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true)
    }

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node
      return target && !tooltipRef?.contains(target) && setIsOpen(false)
    }

    targetRef?.addEventListener('mouseenter', showDropdownMenu)
    targetRef?.addEventListener('mouseleave', hideDropdownMenu)

    return () => {
      targetRef?.removeEventListener('mouseenter', showDropdownMenu)
      targetRef?.removeEventListener('mouseleave', hideDropdownMenu)
    }
  }, [targetRef, tooltipRef, setIsOpen, isBottomNav])

  useEffect(() => {
    if (setMenuOpenByIndex && index !== undefined) {
      setMenuOpenByIndex((prevValue) => ({ ...prevValue, [index]: isMenuShow }))
    }
  }, [isMenuShow, setMenuOpenByIndex, index])

  useOnClickOutside(
    {
      current: targetRef,
    },
    () => {
      setIsOpen(false)
    },
  )

  return (
    <Box ref={setTargetRef} {...props}>
      <Box
        onPointerDown={() => {
          setIsOpen((s) => !s)
        }}
        height="100%"
      >
        {children}
      </Box>
      {hasItems && (
        <StyledDropdownMenu
          style={styles.popper}
          ref={setTooltipRef}
          {...attributes.popper}
          $isBottomNav={isBottomNav}
          $isOpen={isMenuShow}
        >
          {items
            .filter((item) => !item.isMobileOnly)
            .map(
              (
                { type = DropdownMenuItemType.INTERNAL_LINK, label, href = '/', icon, status, ...itemProps },
                itemItem,
              ) => {
                const Icon = icon
                const isActive = href === activeItem
                const MenuItemContent = (
                  <>
                    <Flex style={{ gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                      {isBottomNav ? (
                        <Box width="15px" height="100%">
                          {icon && icon && createElement(Icon as any, { width: '13px' })}
                        </Box>
                      ) : null}
                      <Text
                        fontWeight={isMobile ? '400' : '400'}
                        fontSize={isMobile ? '10px' : '14px'}
                        color={isActive ? 'primary' : 'text'}
                      >
                        {label}
                      </Text>
                      {status && (
                        <LinkStatus color={status.color} fontSize="14px">
                          {status.text}
                        </LinkStatus>
                      )}
                    </Flex>
                  </>
                )
                return (
                  <StyledDropdownMenuItemContainer key={itemItem} $isBottomNav={isBottomNav}>
                    {type === DropdownMenuItemType.BUTTON && (
                      <DropdownMenuItem $isActive={isActive} type="button" {...itemProps}>
                        {MenuItemContent}
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.INTERNAL_LINK && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        as={linkComponent}
                        href={href}
                        onClick={() => {
                          setIsOpen(false)
                          handleCloseMenu()
                        }}
                        {...itemProps}
                      >
                        {MenuItemContent}
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.EXTERNAL_LINK && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        as="a"
                        href={href}
                        target="_blank"
                        onClick={() => {
                          setIsOpen(false)
                        }}
                        {...itemProps}
                      >
                        <Flex alignItems="center" justifyContent="space-between" width="100%">
                          {label}
                          <LogoutIcon />
                        </Flex>
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.DIVIDER && <DropdownMenuDivider />}
                  </StyledDropdownMenuItemContainer>
                )
              },
            )}
        </StyledDropdownMenu>
      )}
    </Box>
  )
}

export default DropdownMenu
