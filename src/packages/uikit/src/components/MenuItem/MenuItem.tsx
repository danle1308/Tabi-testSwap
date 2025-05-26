import React, { useContext } from 'react'
import { MenuContext } from '../../widgets/Menu/context'
import StyledMenuItem, { StyledMenuItemContainer } from './styles'
import { MenuItemProps } from './types'
import { DropdownMenuItemType } from '../DropdownMenu/types'

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  href,
  isActive = false,
  variant = 'default',
  statusColor,
  type,
  handleCloseMenu,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext)
  const itemLinkProps: unknown = href
    ? type === DropdownMenuItemType.EXTERNAL_LINK
      ? {
          as: linkComponent,
          href,
          target: '_blank',
          onClick: () => {
            if (handleCloseMenu) handleCloseMenu()
          },
        }
      : {
          as: linkComponent,
          href,
          onClick: () => {
            if (handleCloseMenu) handleCloseMenu()
          },
        }
    : {
        as: 'div',
      }
  return (
    <StyledMenuItemContainer $isActive={isActive} $variant={variant}>
      <StyledMenuItem {...itemLinkProps} $isActive={isActive} $variant={variant} $statusColor={statusColor} {...props}>
        {children}
      </StyledMenuItem>
    </StyledMenuItemContainer>
  )
}

export default MenuItem
