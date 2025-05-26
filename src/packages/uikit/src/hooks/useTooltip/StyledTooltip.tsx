import styled from 'styled-components'
import { m as Motion } from 'framer-motion'

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: ${({ theme }) => theme.tooltip.background};
  }
`

export const StyledTooltip = styled(Motion.div)`
  padding: 16px;
  font-size: 12px;
  line-height: 130%;
  max-width: 375px;
  z-index: 101;
  /* background: #d5dccc;
  color: #2d5000; */
  box-shadow: ${({ theme }) => theme.tooltip.boxShadow};

  border-radius: 8px;
  background: ${({ theme }) => theme.colors.InvertedContrastColor};
  color: ${({ theme }) => theme.colors.WhiteColorLight};

  &[data-popper-placement^='top'] > ${Arrow} {
    bottom: -4px;
  }

  &[data-popper-placement^='bottom'] > ${Arrow} {
    top: -4px;
  }

  &[data-popper-placement^='left'] > ${Arrow} {
    right: -4px;
  }

  &[data-popper-placement^='right'] > ${Arrow} {
    left: -4px;
  }
`
