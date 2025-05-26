import styled from 'styled-components'
import { Text } from 'packages/uikit'

const MainText = styled(Text)`
  /* color: ${({ theme }) => theme.colors.WhiteColor}; */

  &.opacity-08 {
    opacity: 0.8;
  }
`

export { MainText }
