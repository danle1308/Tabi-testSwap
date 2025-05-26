/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, memo } from 'react'
import styled from 'styled-components'
import { Flex } from '../Box'
import isTouchDevice from '../../util/isTouchDevice'
// import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { DropdownMenu } from '../DropdownMenu'
import MenuItem from '../MenuItem/MenuItem'
import { MenuItemsProps } from './types'
import { Text } from '../Text'
import { useMatchBreakpoints } from '../../hooks'
import { SelectIcon } from '../Svg'

const MenuItems: React.FC<MenuItemsProps> = ({ items = [], activeItem, activeSubItem, handleCloseMenu, ...props }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <Flex style={{ gap: isMobile ? '0px' : '0.5rem' }} {...props}>
      {items.map(({ label, items: menuItems = [], href, icon, type }) => {
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color
        const isActive = activeItem === href
        const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href }
        const Icon = icon

        return (
          <DropdownMenu
            key={`${label}#${href}`}
            items={menuItems}
            py={1}
            activeItem={activeSubItem}
            handleCloseMenu={handleCloseMenu}
          >
            <MenuItem
              {...linkProps}
              isActive={isActive}
              statusColor={statusColor}
              type={type}
              handleCloseMenu={handleCloseMenu}
            >
              <Flex flexDirection={isMobile ? 'row' : 'column'} width="100%" position="relative">
                {isMobile ? (
                  isActive ? (
                    <Flex position="absolute" style={{ left: '8px', top: '3.5px' }}>
                      <SelectIcon width={5} />
                    </Flex>
                  ) : null
                ) : null}
                <Text
                  pt={['0px', , , , '20px']}
                  px={['0px', , , , '10px']}
                  fontSize={[10, , 15, , 20]}
                  fontWeight={isActive ? '600' : '300'}
                  ml={isMobile ? '1.2rem' : '0px'}
                >
                  {label}
                  {!isMobile &&
                    icon &&
                    createElement(Icon as any, {
                      width: '10px',
                      color: 'none',
                      marginLeft: '10px',
                      marginBottom: '5px',
                    })}
                </Text>
                {isMobile ? null : <Flex style={{ borderBottom: isActive ? '2px solid red' : null, width: '100%' }} />}
              </Flex>
            </MenuItem>
          </DropdownMenu>
        )
      })}
    </Flex>
  )
}

export default memo(MenuItems)
