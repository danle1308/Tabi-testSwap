import styled from 'styled-components'
import { scales, PancakeToggleProps, HandleProps, InputProps, ScaleKeys } from './types'

const scaleKeyValues = {
  sm: {
    pancakeSize: '14px', // The size of a pancake (the handle)
    travelDistance: '14px', // How far pancakes should travel horizontally
    toggleHeight: '20px', // General Height and
    toggleWidth: '36px', // Width of a toggle box
    pancakeThickness: '1px', // Bottom shadow of a pancake
    pancakeTwoOffset: '0px', // Pancakes don't look good when they are concentric
    pancakeThreeOffset: '-3px', // so pancake 2 and 3 are shifted a little bit
    butterTop: '3px', // Fine adjustments for butter position
    butterLeft: '10px',
    butterWidth: '6px', // Widht and
    butterHeight: '5px', // Height of a butter block on top of pancakes
    butterThickness: '0.5px', // Shadow on the bottom of the butter block
    butterRadius: '2px', // Rounded corners for the butter
    butterSmearOneTop: '10px', // There is melted butter
    butterSmearOneLeft: '2.5px', // next to the butter block
    butterSmearTwoTop: '11px', // implemented with :before and :after
    butterSmearTwoRight: '2.5px', // these values adjust the position of it
  },
  md: {
    pancakeSize: '24px',
    travelDistance: '24px',
    toggleHeight: '32px',
    toggleWidth: '56px',
    pancakeThickness: '1.5px',
    pancakeTwoOffset: '-1px',
    pancakeThreeOffset: '-6px',
    butterTop: '5px',
    butterLeft: '13px',
    butterWidth: '10px',
    butterHeight: '8px',
    butterThickness: '0.75px',
    butterRadius: '3px',
    butterSmearOneTop: '15px',
    butterSmearOneLeft: '3.75px',
    butterSmearTwoTop: '16px',
    butterSmearTwoRight: '3.75px',
  },
  lg: {
    pancakeSize: '31px',
    travelDistance: '31px',
    toggleHeight: '40px',
    toggleWidth: '72px',
    pancakeThickness: '2px',
    pancakeTwoOffset: '-3px',
    pancakeThreeOffset: '-8px',
    butterTop: '3px',
    butterLeft: '16px',
    butterWidth: '12px',
    butterHeight: '11px',
    butterThickness: '1px',
    butterRadius: '4px',
    butterSmearOneTop: '20px',
    butterSmearOneLeft: '5px',
    butterSmearTwoTop: '22px',
    butterSmearTwoRight: '5px',
  },
}

const getScale =
  (property: ScaleKeys) =>
  ({ scale = scales.LG }: PancakeToggleProps) => {
    return scaleKeyValues[scale][property]
  }

export const PancakeStack = styled.div<HandleProps>`
  position: relative;
  display: inline-block;

  &:label:before {
    content: none;
  }

  .pancakes {
    position: absolute;
    transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .pancake {
    width: ${getScale('pancakeSize')};
    height: ${getScale('pancakeSize')};
    position: absolute;
    top: 2px;
    left: 4px;
    background: #2d5000;
    box-shadow: rgb(189 194 196) 0px 1.5px 0px 1.5px;
    transition: all 0.4s ease 0s;
    border-radius: 50%;
  }

  .katanas {
    width: ${getScale('pancakeSize')};
    height: ${getScale('pancakeSize')};
    /* position: absolute; */
    transition: 0.4s ease;
    top: 2px;
    left: 4px;
    opacity: 0;
  }

  .butter {
    width: ${getScale('butterWidth')};
    height: ${getScale('butterHeight')};
    background: #fbdb60;
    top: ${getScale('butterTop')};
    left: ${getScale('butterLeft')};
    position: absolute;
    border-radius: ${getScale('butterRadius')};
    box-shadow: 0 ${getScale('butterThickness')} 0 ${getScale('butterThickness')} #d67823;
    transform: scale(0);
    transition: 0.2s ease;
  }
`

export const PancakeInput = styled.input<InputProps>`
  height: 40px;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 40px;

  &:focus + label {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:checked + label .pancakes {
    transform: translateX(${getScale('travelDistance')});
  }

  &:checked + label .katanas {
    transition-delay: 0.2s;
    opacity: 1;
  }

  &:checked + label .pancake {
    transition-delay: 0.1s;
    opacity: 0;
  }
`

export const PancakeLabel = styled.label<PancakeToggleProps>`
  width: ${getScale('toggleWidth')};
  height: ${getScale('toggleHeight')};
  background: ${({ theme, checked }) => theme.colors[checked ? 'success' : 'text']};
  box-shadow: ${({ theme }) => theme.shadows.inset};
  display: inline-block;
  border-radius: 50px;
  position: relative;
  transition: all 0.3s ease;
  transform-origin: 20% center;
  cursor: pointer;
  border: 1px solid #2d5000;
`
