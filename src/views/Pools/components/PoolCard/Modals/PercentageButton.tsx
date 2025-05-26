import styled from 'styled-components'
import { Button } from 'packages/uikit'

interface PercentageButtonProps {
  onClick: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
  height: 14px;
  font-size: 8px;
  font-weight: 400;
  border-radius: 10px;
  border: none;
  background: var(--color-red);
  color: white;
`

const PercentageButton: React.FC<PercentageButtonProps> = ({ children, onClick }) => {
  return (
    <StyledButton scale="xs" mx="0px" p="0px 6px" variant="tertiary" onClick={onClick}>
      {children}
    </StyledButton>
  )
}

export default PercentageButton
