import { Box } from 'packages/uikit'
import styled from 'styled-components'

export const StyledPriceChart = styled(Box)<{
  $isDark: boolean
  $isExpanded: boolean
  $isFullWidthContainer?: boolean
}>`
  border: none;
  border-radius: 32px;
  width: 100%;
  padding-top: 36px;
  z-index: 2;
  background: ${({ theme }) => theme.colors.backgroundActive};
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px;
    border: ${({ theme }) => `1px solid ${theme.colors.textActive}`};
    border-radius: ${({ $isExpanded }) => ($isExpanded ? '0' : '16px')};
    width: ${({ $isExpanded, $isFullWidthContainer }) => ($isFullWidthContainer || $isExpanded ? '100%' : '50%')};
    height: ${({ $isExpanded }) => ($isExpanded ? 'calc(100vh - 100px)' : '516px')};
  }
`

StyledPriceChart.defaultProps = {
  height: '70%',
}
