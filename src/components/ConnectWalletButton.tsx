import { Button, useWalletModal, ButtonProps } from 'packages/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import Trans from './Trans'

const ConnectWalletButton = ({ children, variant = 'connect-wallet', ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  const ButtonConnect = styled(Button)`
    position: relative;
    z-index: 1;
  `

  return (
    <ButtonConnect variant={variant} onClick={onPresentConnectModal} {...props}>
      {children || <Trans>Connect Wallet</Trans>}
    </ButtonConnect>
  )
}

export default ConnectWalletButton
