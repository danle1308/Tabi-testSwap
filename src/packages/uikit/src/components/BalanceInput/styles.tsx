import styled from 'styled-components'
import Box from '../Box/Box'
import Input from '../Input/Input'
import Text from '../Text/Text'
import IconButton from '../Button/IconButton'
import { BalanceInputProps } from './types'

export const SwitchUnitsButton = styled(IconButton)`
  width: 16px;
`

export const UnitContainer = styled(Text)`
  margin-left: 4px;
  text-align: right;
  /* color: ${({ theme }) => theme.colors.textScroll}; */
  white-space: nowrap;
`

export const StyledBalanceInput = styled(Box)<{ isWarning: BalanceInputProps['isWarning'] }>`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
  border-radius: 8px;
  box-shadow: ${({ theme, isWarning }) => theme.shadows[isWarning ? 'warning' : 'inset']};
  padding: 8px 16px;
`

export const StyledInput = styled(Input)<{ textAlign?: string }>`
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
  text-align: ${({ textAlign = 'right' }) => textAlign};
  border: none;
  color: ${({ theme }) => theme.colors.BlackColor};

  ::placeholder {
    color: ${({ theme }) => theme.colors.BlackColor};
  }

  &:focus:not(:disabled) {
    box-shadow: none;
  }
`
