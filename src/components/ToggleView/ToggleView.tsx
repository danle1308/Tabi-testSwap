import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from 'packages/uikit'
import { ViewMode } from 'state/user/actions'

interface ToggleViewProps {
  idPrefix: string
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const Container = styled.div`
  margin-left: -8px;
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`

const ToggleView: React.FunctionComponent<ToggleViewProps> = ({ idPrefix, viewMode, onToggle }) => {
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode)
    }
  }

  return (
    <Container>
      <IconButton variant="text" scale="sm" id={`${idPrefix}CardView`} onClick={() => handleToggle(ViewMode.CARD)}>
        <CardViewIcon width="26px" color={viewMode === ViewMode.CARD ? 'MainColor' : 'textScroll'} />
      </IconButton>
      <IconButton variant="text" scale="sm" id={`${idPrefix}TableView`} onClick={() => handleToggle(ViewMode.TABLE)}>
        <ListViewIcon width="26px" color={viewMode === ViewMode.TABLE ? 'MainColor' : 'textScroll'} />
      </IconButton>
    </Container>
  )
}

export default ToggleView
