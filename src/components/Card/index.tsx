import styled from 'styled-components'
import { Box } from 'packages/uikit'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  border: ${({ border }) => border};
  background-color: ${({ theme }) => theme.colors.background};
`
export default Card

export const LightCard = styled(Card)`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.InvertedContrastColor};
`

LightCard.defaultProps = {
  padding: ['16px'],
}

export const LightGreyCard = styled(Card)`
  /* border: 1px solid ${({ theme }) => theme.colors.cardBorder}; */
  background-color: ${({ theme }) => theme.colors.InputBg};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.dropdown};
`
