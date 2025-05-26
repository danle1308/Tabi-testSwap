import styled from 'styled-components'

export const MainContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.mainValues.contentWidth}px;
  margin: auto;
`
