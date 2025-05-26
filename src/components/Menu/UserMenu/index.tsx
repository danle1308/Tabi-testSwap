/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  WalletIcon,
  // Box,
} from 'packages/uikit'
import Trans from 'components/Trans'
import useAuth from 'hooks/useAuth'
import { useRouter } from 'next/router'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
// import { nftsBaseUrl } from 'views/Nft/market/constants'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'packages/uikit/src/hooks'
import WalletModal, { WalletView } from './WalletModal'
import UserModal, { WalletUserView } from '../Modals/UserModal'
// import ProfileUserMenuItem from './ProfileUserMenuItem'
import WalletUserMenuItem from './WalletUserMenuItem'

const RestyledButtonConnect = styled(ConnectWalletButton)`
  height: 25px;
  box-shadow: 0px 1.5px 0px 0px #ffffff;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 48px;
    box-shadow: 0px 3px 0px 0px #ffffff;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
  }
`

const UserMenu = () => {
  // const router = useRouter()
  const { t } = useTranslation()
  const { account, error } = useWeb3React()
  const { logout } = useAuth()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<UserModal initialView={WalletUserView.INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)
  // const hasProfile = isInitialized && !!profile
  const avatarSrc = profile?.nft?.image?.thumbnail
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')
  const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError
  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  const onClickWalletMenu = (): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }

  const UserMenuItems = () => {
    return (
      <>
        {/* <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
        <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
          {t('Recent Transactions')}
          {hasPendingTransactions && <RefreshIcon spin />}
        </UserMenuItem>
        <UserMenuDivider />
        <UserMenuItem as="button" onClick={logout}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Disconnect')}
            <LogoutIcon color="#ffffff" />
          </Flex>
        </UserMenuItem> */}
      </>
    )
  }

  if (account) {
    return (
      <UIKitUserMenu
        account={account}
        avatarSrc={avatarSrc}
        text={userMenuText}
        variant={userMenuVariable}
        onClick={onClickWalletMenu}
      >
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger" onClick={onClickWalletMenu}>
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <RestyledButtonConnect scale={isMobile ? 'xs' : 'md'} startIcon={<WalletIcon width={isMobile ? '10px' : '20px'} />}>
      <Trans>{isMobile ? 'Connect' : 'Connect Wallet'}</Trans>
    </RestyledButtonConnect>
  )
}

export default UserMenu
