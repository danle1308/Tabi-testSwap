import styled, { DefaultTheme } from 'styled-components'
import { InputProps, scales } from './types'

interface StyledInputProps extends InputProps {
  theme: DefaultTheme
}

/**
 * Priority: Warning --> Success
 */
const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  if (isSuccess) {
    return theme.shadows.success
  }

  return theme.shadows.inset
}

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return '32px'
    case scales.LG:
      return '48px'
    case scales.MD:
    default:
      return '40px'
  }
}

const Input = styled.input<InputProps>`
  border: 0;
  /* box-shadow: ${getBoxShadow}; */
  display: block;
  font-size: 16px;
  height: ${getHeight};
  outline: 0;
  padding: 0 16px;
  width: 100%;
  /* border: 1px solid #2d5000;
  background: #d5dccc; */
  color: ${({ theme }) => theme.colors.textScroll};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textScroll};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    /* box-shadow: ${({ theme }) => theme.shadows.focus}; */
  }
`

Input.defaultProps = {
  scale: scales.MD,
  isSuccess: false,
  isWarning: false,
}

export default Input
