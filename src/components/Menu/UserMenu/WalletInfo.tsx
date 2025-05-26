import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from 'packages/uikit'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'

import { getBscScanLink } from 'utils'
import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import styled from 'styled-components'
import { ETHER } from '@tabi-dex/sdk'
import CopyAddress from './CopyAddress'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const StyledText = styled(Text)`
    color: ${({ theme }) => theme.colors.WhiteColor};
    opacity: 0.8;
  `

  const StyledMessage = styled(Message)`
    background: ${({ theme }) => theme.colors.InvertedContrastColor};
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.colors.MainColor};
  `

  const WalletInfoLinkExternal = styled(LinkExternal)`
    color: ${({ theme }) => theme.colors.WhiteColor};
    font-size: 14px;
    /* font-weight: 400; */
  `

  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens.cake.address)
  const { logout } = useAuth()
  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  return (
    <>
      <StyledText fontWeight="400" mb="8px">
        {t('Your Address')}
      </StyledText>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <StyledMessage variant="warning" mb="24px">
          <Box>
            <StyledText>{t('%symbol% Balance Low', { symbol: ETHER.symbol })}</StyledText>
            <StyledText fontSize="10px" as="p">
              {t('You need %symbol% for transaction fees.', { symbol: ETHER.symbol })}
            </StyledText>
          </Box>
        </StyledMessage>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <StyledText>{t('%symbol% Balance', { symbol: ETHER.symbol })}</StyledText>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <StyledText>{formatBigNumber(balance, 6)}</StyledText>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <StyledText>{t('%symbol% Balance', { symbol: tokens.cake.symbol })}</StyledText>
        {cakeFetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <StyledText>{getFullDisplayBalance(cakeBalance, 18, 3)}</StyledText>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="start" mb="8px">
        <WalletInfoLinkExternal href={getBscScanLink(account, 'address')} color="#ffffff">
          {t('View on Explorer')}
        </WalletInfoLinkExternal>
      </Flex>
      <Button width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
