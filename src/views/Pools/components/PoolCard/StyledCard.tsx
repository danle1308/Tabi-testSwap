import styled from 'styled-components'
import { Card } from 'packages/uikit'
import { StyledCardInner } from 'packages/uikit/src/components/Card/StyledCard'

export const StyledCard = styled(Card)<{ isFinished?: boolean }>`
  min-width: 280px;
  max-width: 100%;
  margin: 0 0 24px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'WhiteColorLight']};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }

  ${StyledCardInner} {
    display: flex;
    flex-direction: column;
  }
`

export default StyledCard
