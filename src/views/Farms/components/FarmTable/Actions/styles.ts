import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.InvertedContrastColor};
  border-radius: 8px;
  width: 100%;

  /* ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    max-height: 100px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 48px;
    margin-right: 0;
    margin-bottom: 0;
    max-height: 120px;
  } */
`

export const ActionTitles = styled.div`
  display: flex;
  /* margin-bottom: 16px; */
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
