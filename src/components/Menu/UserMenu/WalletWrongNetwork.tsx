import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, Text, Link, HelpIcon, useMatchBreakpoints } from 'packages/uikit'
import { setupNetwork } from 'utils/wallet'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
// import darkTheme from 'packages/uikit/src/theme/dark'
import { UIButton } from 'components/TabiSwap/components/ui'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

const HelpButton = styled(Button)`
  border-radius: 8px;
  border-color: ${({ theme }) => theme.colors.MainColor};
`

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<WalletWrongNetworkProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { connector, library } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const handleSwitchNetwork = async (): Promise<void> => {
    await setupNetwork(library)
    onDismiss?.()
  }

  return (
    <>
      <Text
        style={{ alignSelf: 'center', fontSize: isMobile ? '10px' : '14px' }}
        mt="10px"
        mb={isMobile ? '10px' : '14px'}
      >
        {t('You’re connected to the wrong network.')}
      </Text>
      {connector instanceof InjectedConnector && (
        <Button style={{ fontSize: isMobile ? '12px' : '14px' }} onClick={handleSwitchNetwork}>
          {t('Switch Network')}
        </Button>
      )}
      {/* <StyledLink href="#" external>
        <HelpButton width="100%" variant="secondary">
          {t('Learn How')}
          <HelpIcon color="primary" ml="6px" />
        </HelpButton>
      </StyledLink> */}
    </>
  )
}

export default WalletWrongNetwork
