import styled from 'styled-components'
import { Text, ChevronDownIcon } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell from './BaseCell'

interface ExpandActionCellProps {
  expanded: boolean
  isFullLayout: boolean
}

const StyledCell = styled(BaseCell)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  padding-right: 12px;
  padding-left: 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
    padding-right: 32px;
    padding-left: 8px;
  }
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const TotalStakedCell: React.FC<ExpandActionCellProps> = ({ expanded, isFullLayout, ...props }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell" {...props}>
      {isFullLayout && (
        <Text color="var(--core-color)" bold>
          {expanded ? t('Hide') : t('Details')}
        </Text>
      )}
      {/* <ArrowIcon color="primary" toggled={expanded} /> */}
    </StyledCell>
  )
}

export default TotalStakedCell
