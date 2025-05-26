import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { getActiveMenuItem } from '../../Menu/utils'
import { useMenuItems } from './hooks/useMenuItems'
import { VenusMenuItem } from '../components/ui/VenusMenuItem'

export type MenuItem = {
  label: string
  href: string
  icon: React.ReactNode
}

export const Sidebar: React.FC = () => {
  const menuItems = useMenuItems()
  const { pathname } = useRouter()
  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })

  return <></>
}

export const MenuList: React.FC<{ items: []; activeItem: string }> = ({ items, activeItem }) => {
  return (
    <ul>
      {items.map((item: MenuItem) => {
        const isActive = activeItem === item.href

        return (
          <VenusMenuItem key={item.label} isActive={isActive} href={item.href}>
            {item.icon}
            {item.label}
          </VenusMenuItem>
        )
      })}
    </ul>
  )
}
