import { Box, Flex, FlexProps } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { CopyButton } from '../../CopyButton'

interface CopyAddressProps extends FlexProps {
  account: string
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.InvertedContrastColor};
  position: relative;
  border-radius: 8px;
`

const Address = styled.div`
  flex: 1;
  position: relative;
  padding-left: 16px;

  & > input {
    background: transparent;
    color: ${({ theme }) => theme.colors.WhiteColor};
    display: block;
    font-weight: 500;
    font-size: 14px;
    padding: 0;
    width: 100%;
    border: 0;

    &:focus {
      outline: 0;
    }
  }
`

const CopyAddress: React.FC<CopyAddressProps> = ({ account, ...props }) => {
  const { t } = useTranslation()
  const accountEllipsis = account ? `${account.substring(0, 11)}...${account.substring(account.length - 11)}` : null

  return (
    <Box position="relative" {...props}>
      <Wrapper>
        <Address title={accountEllipsis}>
          <input type="text" readOnly value={accountEllipsis} />
        </Address>
        <Flex margin="12px">
          <CopyButton width="24px" text={account} tooltipMessage={t('Copied')} tooltipTop={-40} />
        </Flex>
      </Wrapper>
    </Box>
  )
}

export default CopyAddress
