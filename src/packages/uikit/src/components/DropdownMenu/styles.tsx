import styled, { DefaultTheme } from 'styled-components'
import { Colors } from '../../theme'
import { Text } from '../Text'
import { StyledDropdownMenuItemProps } from './types'

const getTextColor = ({
  $isActive,
  disabled,
  theme,
}: StyledDropdownMenuItemProps & { theme: DefaultTheme; $isActive: boolean }) => {
  if (disabled) return theme.colors.textDisabled
  if ($isActive) return theme.colors.secondary

  return theme.colors.textSubtle
}

export const DropdownMenuItem = styled.button<StyledDropdownMenuItemProps & { $isActive: boolean }>`
  align-items: center;
  border: 0;
  background: black;
  color: black;
  /* color: ${({ theme, disabled, $isActive }) => getTextColor({ theme, disabled, $isActive })}; */
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: ${({ $isActive = false }) => ($isActive ? '600' : '400')};
  display: flex;
  font-size: 10px;
  height: 20px;
  justify-content: space-between;
  outline: 0;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:active:not(:disabled) {
    opacity: 0.85;
    transform: translateY(1px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 30px;
    font-size: 16px;
  }
`

export const StyledDropdownMenuItemContainer = styled.div`
  &:first-child > ${DropdownMenuItem} {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child > ${DropdownMenuItem} {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`

export const DropdownMenuDivider = styled.hr`
  border-color: ${({ theme }) => theme.colors.cardBorder};
  border-style: solid;
  border-width: 1px 0 0;
  margin: 4px 0;
`

export const StyledDropdownMenu = styled.div<{ $isOpen: boolean; $isBottomNav: boolean }>`
  /* background-color: ${({ theme }) => theme.card.background}; */
  border: 1px solid rgba(250, 250, 250, 0.5);
  border-radius: 10px;
  /* padding-bottom: 4px; */
  /* padding-top: 4px; */
  pointer-events: auto;
  width: 120px;
  visibility: visible;
  z-index: 1001;

  ${({ $isOpen }) =>
    !$isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${({ theme }) => theme.mediaQueries.md} {
    width: 183px;
  }
`

export const LinkStatus = styled(Text)<{ color: keyof Colors }>`
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0 8px;
  border: 2px solid;
  border-color: ${({ theme, color }) => theme.colors[color]};
  box-shadow: none;
  color: ${({ theme, color }) => theme.colors[color]};
  margin-left: 8px;
`
