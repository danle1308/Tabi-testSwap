import React from 'react'
import { isDesktop } from 'react-device-detect'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text'
import MoreHorizontal from '../../components/Svg/Icons/MoreHorizontal'
import { ButtonProps } from '../../components/Button'
import { connectorLocalStorageKey, walletConnectConfig, walletLocalStorageKey } from './config'
import { Login, Config } from './types'
import { useMatchBreakpoints } from '../../hooks'

interface Props {
  walletConfig: Config
  login: Login
  onDismiss: () => void
  fontSize: string
  fontColor: string
}

const WalletButton = styled(Button).attrs({ width: '100%', variant: 'text' })`
  display: flex;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 5px 15px;

  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 10px 15px;
  }
`

interface MoreWalletCardProps extends ButtonProps {
  t: (key: string) => string
}

export const MoreWalletCard: React.FC<MoreWalletCardProps> = ({ t, ...props }) => {
  return (
    <WalletButton variant="tertiary" {...props}>
      <MoreHorizontal width="40px" mb="8px" color="textSubtle" />
      <Text fontSize="14px">{t('More')}</Text>
    </WalletButton>
  )
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss, fontSize, fontColor, ...props }) => {
  const { title, icon: Icon } = walletConfig
  const { isMobile } = useMatchBreakpoints()
  return (
    <WalletButton
      variant="tertiary"
      onClick={() => {
        // TW point to WC on desktop
        if (title === 'Trust Wallet' && walletConnectConfig && isDesktop) {
          login(walletConnectConfig.connectorId)
          localStorage?.setItem(walletLocalStorageKey, walletConnectConfig.title)
          localStorage?.setItem(connectorLocalStorageKey, walletConnectConfig.connectorId)
          onDismiss()
          return
        }
        if (!window.ethereum && walletConfig.href) {
          window.open(walletConfig.href, '_blank', 'noopener noreferrer')
        } else {
          login(walletConfig.connectorId)
          localStorage?.setItem(walletLocalStorageKey, walletConfig.title)
          localStorage?.setItem(connectorLocalStorageKey, walletConfig.connectorId)
          onDismiss()
        }
      }}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
      {...props}
    >
      <Icon width={isMobile ? '15px' : '28px'} />
      <Text fontSize={fontSize} color={fontColor} bold>
        {title}
      </Text>
    </WalletButton>
  )
}

export default WalletCard
