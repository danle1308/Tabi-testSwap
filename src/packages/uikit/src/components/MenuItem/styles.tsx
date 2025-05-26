import styled, { css } from 'styled-components'
import { StyledMenuItemProps } from './types'

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;
  /* padding: 4px 12px; */
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    /* padding: 12px; */
  }

  ${({ $isActive, $variant, theme }) =>
    $isActive &&
    $variant === 'subMenu' &&
    `
      &:after{
        content: "";
        position: absolute;
        bottom: 0;
        height: 4px;
        width: 100%;
        background-color: ${theme.colors.primary};
        border-radius: 2px 2px 0 0;
      }
    `};
`

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  /* position: relative;
  display: flex;
  gap: 11px;
  align-items: center;
  border: 0;
  border-radius: ${({ $isActive }) => ($isActive ? '50px' : '0')};
  color: #000000;
  background: transparent;
  font-size: 32px;
  font-weight: 700; */

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 0.8em;

  color: ${({ theme }) => theme.colors.BlackColor};
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 0;

  /* &::before {
    content: '';
    position: absolute;
    left: 5px;

    width: 14px;
    height: 10px;
    opacity: 0;
    background: url('/images/svgs/link-active.svg');

    ${({ $isActive }) =>
    $isActive &&
    css`
      opacity: 1;
    `}
  } */

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }

  /* ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 10px;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}

  ${({ $variant }) =>
    $variant === 'default'
      ? `
    padding: 0 16px;
    height: 48px;
  `
      : `
    padding: 4px 4px 0px 4px;
    height: 42px;
  `} */
`

export default StyledMenuItem
