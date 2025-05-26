import styled from 'styled-components'

const Label = styled.div`
  font-size: 12px;
  text-align: left;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.WhiteColor};
`

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.WhiteColor};
`

interface CellLayoutProps {
  label?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </div>
  )
}

export default CellLayout
