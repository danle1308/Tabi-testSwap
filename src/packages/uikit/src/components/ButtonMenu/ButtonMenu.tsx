import React, { cloneElement, Children, ReactElement } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { space } from 'styled-system'
import { scales, variants } from '../Button/types'
import { ButtonMenuProps } from './types'

interface StyledButtonMenuProps extends ButtonMenuProps {
  theme: DefaultTheme
  $isActive: boolean
}

// const getBackgroundColor = ({ theme, variant }: StyledButtonMenuProps) => {
//   return theme.colors[variant === variants.SUBTLE ? 'input' : 'tertiary']
// }

// const getBorderColor = ({ theme, variant }: StyledButtonMenuProps) => {
//   return theme.colors[variant === variants.SUBTLE ? 'inputSecondary' : 'disabled']
// }

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  background-color: transparent;
  display: ${({ fullWidth }) => (fullWidth ? 'flex' : 'inline-flex')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  gap: 13px;

  & > button,
  & > a {
    flex: ${({ fullWidth }) => (fullWidth ? 1 : 'auto')};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    font-weight: 400;
  }

  & > button + button,
  & > a + a {
    margin-left: 2px; // To avoid focus shadow overlap
  }

  & > button,
  & a {
    box-shadow: none;
    flex: ${({ fullWidth }) => (fullWidth ? 1 : 'auto')};
    border: 0;
    font-weight: 500;
  }

  ${({ disabled, theme, variant }) => {
    if (disabled) {
      return `
        opacity: 0.5;
        & > button:disabled {
          color: ${variant === variants.PRIMARY ? theme.colors.primary : theme.colors.textSubtle};
        }
    `
    }
    return ''
  }}
  ${space}
`

const ButtonMenu: React.FC<ButtonMenuProps> = ({
  activeIndex = 0,
  scale = scales.MD,
  variant = variants.PRIMARY,
  onItemClick,
  disabled,
  children,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButtonMenu disabled={disabled} variant={variant} fullWidth={fullWidth} {...props}>
      {Children.map(children, (child: ReactElement, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
          scale,
          variant,
          disabled,
        })
      })}
    </StyledButtonMenu>
  )
}

export default ButtonMenu
