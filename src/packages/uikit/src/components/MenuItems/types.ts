/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from 'react'
import { BoxProps } from '../Box'
import { DropdownMenuItems } from '../DropdownMenu/types'

export type MenuItemsType = {
  label: string
  href: string
  icon?: ElementType<any>
  fillIcon?: ElementType<any>
  items?: DropdownMenuItems[]
  showOnMobile?: boolean
  showItemsOnMobile?: boolean
  type?: any
}

export interface MenuItemsProps extends BoxProps {
  items: MenuItemsType[]
  activeItem?: string
  activeSubItem?: string
  handleCloseMenu?: any
}
