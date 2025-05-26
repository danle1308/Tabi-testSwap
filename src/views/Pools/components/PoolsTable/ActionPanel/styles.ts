import styled from 'styled-components'
import { Flex } from 'packages/uikit'

export const ActionContainer = styled(Flex)`
  flex-direction: column;
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.InvertedContrastColor};
  padding: 16px 24px;
  border-radius: 8px;
`

ActionContainer.defaultProps = {
  flex: 1,
}

export const RowActionContainer = styled(ActionContainer)`
  flex-direction: row;
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
`

export const ActionContent = styled(Flex)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

ActionContent.defaultProps = {
  mt: '8px',
}
