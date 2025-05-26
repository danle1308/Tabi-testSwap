import { useState } from 'react'
import {
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
  useMatchBreakpoints,
} from 'packages/uikit'
import { parseUnits } from '@ethersproject/units'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { FetchStatus } from 'config/constants/types'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'
import WalletWrongNetwork from './WalletWrongNetwork'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_BNB_BALANCE = parseUnits('2', 'gwei')

const ModalHeader = styled(UIKitModalHeader)`
  background: none;
  padding: 10px 0px 0 15px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 15px 0px 15px 15px;
  }
`

const Tabs = styled.div`
  margin: 16px 24px;
`

const StyledHeading = styled(Heading)`
  font-size: 14px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const StyledModalContainer = styled(ModalContainer)`
  background: ${({ theme }) => theme.colors.ModalBg};
`

const TabsButton = styled(ButtonMenuItem)`
  border-radius: 8px;
  background-color: ${({ isActive }) => (isActive ? `#ffffff` : `#000000`)};
  color: ${({ isActive }) => (isActive ? `#000000` : `#ffffff`)};
  font-weight: 700 !important;
`

const WalletModal: React.FC<WalletModalProps> = ({ initialView = WalletView.WALLET_INFO, onDismiss }) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { balance, fetchStatus } = useGetBnbBalance()
  const hasLowBnbBalance = fetchStatus === FetchStatus.Fetched && balance.lte(LOW_BNB_BALANCE)

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  const TabsComponent: React.FC = () => (
    <Tabs>
      <ButtonMenu scale="sm" onItemClick={handleClick} activeIndex={view} fullWidth>
        <TabsButton>{t('Wallet')}</TabsButton>
        <TabsButton>{t('Transactions')}</TabsButton>
      </ButtonMenu>
    </Tabs>
  )

  return (
    <StyledModalContainer title={t('Welcome!')} style={{ width: '100%', maxWidth: isMobile ? '238px' : '369px' }}>
      <ModalHeader>
        <ModalTitle>
          <StyledHeading>{t('Your Wallet')}</StyledHeading>
        </ModalTitle>
        <IconButton scale="xs" variant="text" onClick={onDismiss}>
          <CloseIcon width={isMobile ? '17px' : '24px'} color="#ffffff" />
        </IconButton>
      </ModalHeader>
      {view !== WalletView.WRONG_NETWORK && <TabsComponent />}
      <ModalBody
        p={view === WalletView.WRONG_NETWORK ? '0 17px 17px' : '24px'}
        minWidth={isMobile ? 'auto' : '320px'}
        width="100%"
      >
        {view === WalletView.WALLET_INFO && <WalletInfo hasLowBnbBalance={hasLowBnbBalance} onDismiss={onDismiss} />}
        {view === WalletView.TRANSACTIONS && <WalletTransactions />}
        {view === WalletView.WRONG_NETWORK && <WalletWrongNetwork onDismiss={onDismiss} />}
      </ModalBody>
    </StyledModalContainer>
  )
}

export default WalletModal
