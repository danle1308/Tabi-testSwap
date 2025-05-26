import { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import Text from '../Text/Text'

interface SliderLabelProps {
  progress: string
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean
}

interface DisabledProp {
  disabled?: boolean
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? 'not-allowed' : 'cursor'
}

const getBaseThumbStyles = ({ isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  background-size: contain;
  background-repeat: no-repeat;
  background: linear-gradient(to left, #2a3fa9, #fff);
  background-position: right;
  border: 0;
  border-radius: 50%;
  cursor: ${getCursorStyle};
  width: 10px;
  aspect-ratio: 1/1;
  filter: ${disabled ? 'grayscale(100%)' : 'none'};
  transform: translate(0, 6px);
  transition: 200ms transform;

  &:hover {
    transform: ${disabled ? 'scale(1)' : 'scale(1.1)'};
  }
`

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`

export const BunnyButt = styled.div<DisabledProp>`
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  width: 10px;
  aspect-ratio: 1/1;
  background-size: contain;
  background-position: right;
`

export const BunnySlider = styled.div`
  position: absolute;
  left: 12px;
  width: calc(100% - 14px);
`

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 32px;
  position: relative;

  ::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }

  ::-moz-range-thumb {
    ${getBaseThumbStyles}
  }

  ::-ms-thumb {
    ${getBaseThumbStyles}
  }
`

export const BarBackground = styled.div<DisabledProp>`
  /* background-color: ${({ theme, disabled }) => theme.colors[disabled ? 'textDisabled' : 'inputSecondary']}; */
  height: 2px;
  position: absolute;
  /* top: 18px; */
  width: 100%;
  height: 100%;
`

export const BarProgress = styled.div<DisabledProp>`
  /* background-color: ${({ theme }) => theme.colors.primary}; */
  background-image: linear-gradient(to right, #2a3fa9, #fff);
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  height: 2px;
  position: absolute;
  top: 50%;
  transform: translateY(calc(-50% + 5px));
`
