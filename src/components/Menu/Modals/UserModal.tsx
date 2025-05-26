import {
  Modal,
  MetamaskIcon,
  Text,
  OpenNewIcon,
  LinkIcon,
  Link,
  InjectedModalProps,
  Button,
  LogoutIcon,
  ChevronLeftIcon,
  Box,
  Flex,
  useMatchBreakpoints,
} from 'packages/uikit'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { FlexGap } from 'components/Layout/Flex'
import truncateHash from 'utils/truncateHash'
import { CopyButton } from 'components/CopyButton'
import { getBscScanLink } from 'utils'
import { FetchStatus } from 'config/constants/types'
import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import tokens from 'config/constants/tokens'
import { ETHER } from '@tabi-dex/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useState } from 'react'
import styled from 'styled-components'
import useAuth from 'hooks/useAuth'
import { CurrencyLogo } from 'components/Logo'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import orderBy from 'lodash/orderBy'
import WalletTransactions from '../UserMenu/WalletTransactions'

export enum WalletUserView {
  INFO,
  BALANCE,
  ACTIVITY,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletUserView
}

const Header = ({ onBack, title }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <FlexGap alignItems="center" justifyContent="space-between">
      <ButtonView onClick={onBack} height="auto">
        <ChevronLeftIcon width={isMobile ? '7px' : '10px'} />
      </ButtonView>
      <Text fontSize={[12, , , , 14]} fontWeight="500" width="100%" textAlign="center">
        {title}
      </Text>
      <FlexGap />
    </FlexGap>
  )
}

const InfoView = ({ onDismiss, handleClick }) => {
  const { account } = useActiveWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <FlexGap flexDirection="column" mb={isMobile ? '5px' : '16px'} alignItems="center">
        <FlexGap
          width={[30, , , , 40]}
          height={[30, , , , 40]}
          borderRadius="50%"
          border="2.5px solid var(--color-white)"
          justifyContent="center"
          position="relative"
        >
          <MetamaskIcon width={isMobile ? '17px' : '22px'} />
          <Flex
            style={{
              position: 'absolute',
              bottom: isMobile ? '-3px' : '-5.5px',
              right: isMobile ? '-9.5px' : '-16px',
              zIndex: '1000',
            }}
          >
            <img alt="#" src="/images/logoSmall.png" width={isMobile ? 15 : 25} />
          </Flex>
        </FlexGap>
        <FlexGap position="relative">
          <Text fontSize={[12, , , , 17]} bold>
            {truncateHash(account, 5, 4)}
          </Text>
          <CopyButton width="10px" text={account} tooltipMessage="" tooltipTop={0} />
          <Link href={getBscScanLink(account, 'address')} external>
            <LinkIcon width="10px" />
          </Link>
        </FlexGap>
        <Text fontSize={[12, , , , 17]} fontWeight="500" color="#9B9B9B">
          {fetchStatus !== FetchStatus.Fetched ? '0.00' : formatBigNumber(balance, 6)} {ETHER.symbol}
        </Text>
      </FlexGap>

      <FlexGap flexDirection="column">
        <ButtonView onClick={() => handleClick(WalletUserView.BALANCE)}>
          <Wrapper style={{ padding: isMobile ? '0 0.4rem 0 0.6rem' : '0 0.7rem' }}>
            Balance
            <img src="/images/chevron-right-box.svg" alt="" width={isMobile ? '15px' : '20px'} />
          </Wrapper>
        </ButtonView>
        <ButtonView onClick={() => handleClick(WalletUserView.ACTIVITY)}>
          <Wrapper style={{ padding: isMobile ? '0 0.4rem 0 0.6rem' : '0 0.7rem' }}>
            Activity
            <img src="/images/chevron-right-box.svg" alt="" width={isMobile ? '15px' : '20px'} />
          </Wrapper>
        </ButtonView>
        <ButtonView onClick={handleLogout}>
          <Wrapper style={{ padding: isMobile ? '0 0.4rem 0 0.6rem' : '0 0.7rem' }}>
            Disconnect
            <IconButton>
              <LogoutIcon width={isMobile ? '9px' : '14px'} />
            </IconButton>
          </Wrapper>
        </ButtonView>
      </FlexGap>
    </>
  )
}

const BalanceView = ({ onBack }) => {
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens.cake.address)
  const { balance: usdcBalance, fetchStatus: usdcFetchStatus } = useTokenBalance(tokens.usdc.address)
  const { balance: wethBalance, fetchStatus: wethFetchStatus } = useTokenBalance(tokens.weth.address)
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <Header onBack={onBack} title="Your Balance" />

      <Body>
        <FlexGap flexDirection="column">
          <ButtonView>
            <Wrapper>
              <FlexGap alignItems="center">
                <CurrencyLogo currency={tokens.cake} size={isMobile ? '15px' : '25px'} />
                <Text fontWeight="500" fontSize={[10, , , , 14]}>
                  {tokens.cake.symbol}
                </Text>
              </FlexGap>
              <Text fontWeight="500" fontSize={[10, , , , 14]}>
                {cakeFetchStatus === FetchStatus.Fetched
                  ? getFullDisplayBalance(cakeBalance, tokens.cake.decimals, 3)
                  : '0.00'}
              </Text>
            </Wrapper>
          </ButtonView>

          <ButtonView>
            <Wrapper>
              <FlexGap alignItems="center">
                <CurrencyLogo currency={tokens.usdc} size={isMobile ? '15px' : '25px'} />
                <Text fontWeight="500" fontSize={[10, , , , 14]}>
                  {tokens.usdc.symbol}
                </Text>
              </FlexGap>
              <Text fontWeight="500" fontSize={[10, , , , 14]}>
                {usdcFetchStatus === FetchStatus.Fetched
                  ? getFullDisplayBalance(usdcBalance, tokens.usdc.decimals, 3)
                  : '0.00'}
              </Text>
            </Wrapper>
          </ButtonView>

          <ButtonView>
            <Wrapper>
              <FlexGap alignItems="center">
                <CurrencyLogo currency={tokens.weth} size={isMobile ? '15px' : '25px'} />
                <Text fontWeight="500" fontSize={[10, , , , 14]}>
                  {tokens.weth.symbol}
                </Text>
              </FlexGap>
              <Text fontWeight="500" fontSize={[10, , , , 14]}>
                {wethFetchStatus === FetchStatus.Fetched
                  ? getFullDisplayBalance(wethBalance, tokens.weth.decimals, 3)
                  : '0.00'}
              </Text>
            </Wrapper>
          </ButtonView>
        </FlexGap>
      </Body>
    </>
  )
}

const ActivityView = ({ onBack }) => {
  const [isClear, setIsClear] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const allTransactions = useAllTransactions()
  const sortedTransactions = orderBy(Object.values(allTransactions).filter(isTransactionRecent), 'addedTime', 'desc')

  const handleClearAll = () => {
    setIsClear(true)
  }

  return (
    <>
      <Header onBack={onBack} title="Activity" />
      <BodySecond>
        <WalletTransactions isClear={isClear} setIsClear={setIsClear} />
      </BodySecond>
      {sortedTransactions.length > 0 && (
        <Button
          scale="xs"
          onClick={handleClearAll}
          variant="text"
          px="0"
          style={{ color: 'var(--color-red)', fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}
        >
          Clear All
        </Button>
      )}
    </>
  )
}

const UserModal: React.FC<WalletModalProps> = ({ initialView, onDismiss }) => {
  const [view, setView] = useState(initialView)

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  const onBack = () => setView(WalletUserView.INFO)

  return (
    <Modal
      title=""
      noHeader
      onDismiss={onDismiss}
      bodyPadding={[view === WalletUserView.ACTIVITY ? '10px 8px 15px 13px' : '10px 15px 15px 15px', , , , '16px']}
      maxWidth={['238px', '290px', '320px', , '351px']}
      topIconButton={['10px']}
    >
      {view === WalletUserView.INFO ? <InfoView onDismiss={onDismiss} handleClick={handleClick} /> : null}
      {view === WalletUserView.BALANCE ? <BalanceView onBack={onBack} /> : null}
      {view === WalletUserView.ACTIVITY ? <ActivityView onBack={onBack} /> : null}
    </Modal>
  )
}

export default UserModal

const Wrapper = styled(FlexGap).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#FFFFFF33',
  borderRadius: '30px',
  padding: ['0 0.4rem', , , , '0 0.7rem'],
  width: '100%',
  height: '100%',
})``

const ButtonView = styled(Button).attrs({ variant: 'text', padding: '0', fontSize: [10, , , , 14] })`
  height: 28px;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 40px;
  }
`

const IconButton = styled(FlexGap).attrs({
  width: [15, , , , 20],
  background: 'var(--color-white)',
  borderRadius: '50%',
  justifyContent: 'center',
})`
  aspect-ratio: 1/1;
  height: auto;
`

const Body = styled(Box).attrs({ pt: ['0px', , , , '0px'], px: ['0px', , , , '0px'] })``

const BodySecond = styled(Box).attrs({
  mb: ['30px', , , , '40px'],
  p: ['0px 5px 0px 0px', , , , '0px 5px 0px 0px'],
  mt: ['0px', , , , '5px'],
})`
  overflow-y: scroll;
  max-height: 150px;
  /* position: relative; */

  ::-webkit-scrollbar {
    width: 2px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 250px;
  }
`
