import React, { useState } from 'react'
import styled from 'styled-components'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import Grid from '../../components/Box/Grid'
import Box from '../../components/Box/Box'
import Text from '../../components/Text/Text'
import Heading from '../../components/Heading/Heading'
import { Button } from '../../components/Button'
import { ModalBody, ModalCloseButton, ModalContainer, ModalHeader, ModalTitle } from '../Modal'
import WalletCard from './WalletCard'
import config, { walletLocalStorageKey } from './config'
import { Config, Login } from './types'
import { Flex } from '../../components/Box'
import { useMatchBreakpoints } from '../../hooks'

interface Props {
  login: Login
  onDismiss?: () => void
  displayCount?: number
  t: (key: string) => string
}

const WalletWrapper = styled(Box).attrs({ mb: ['1.5rem'] })`
  /* display: grid;
  grid-template-columns: max-content; */

  display: grid;
  grid-gap: 0.5rem;
`

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: #bfbfbf;
  opacity: 0.3;
`

const StyledModalContainer = styled(ModalContainer)`
  /* background: ${({ theme }) => theme.colors.ModalBg}; */
  height: auto;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.WhiteColor};
  max-width: 238px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 365px;
  }
`

const getPriority = (priority: Config['priority']) => (typeof priority === 'function' ? priority() : priority)

/**
 * Checks local storage if we have saved the last wallet the user connected with
 * If we find something we put it at the top of the list
 *
 * @returns sorted config
 */
const getPreferredConfig = (walletConfig: Config[]) => {
  const sortedConfig = walletConfig.sort((a: Config, b: Config) => getPriority(a.priority) - getPriority(b.priority))

  const preferredWalletName = localStorage?.getItem(walletLocalStorageKey)

  if (!preferredWalletName) {
    return sortedConfig
  }

  const preferredWallet = sortedConfig.find((sortedWalletConfig) => sortedWalletConfig.title === preferredWalletName)

  if (!preferredWallet) {
    return sortedConfig
  }

  return [
    preferredWallet,
    ...sortedConfig.filter((sortedWalletConfig) => sortedWalletConfig.title !== preferredWalletName),
  ]
}

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null, displayCount = 4, t }) => {
  const [showMore] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const sortedConfig = getPreferredConfig(config)
  // Filter out WalletConnect if user is inside TrustWallet built-in browser
  const walletsToShow = window.ethereum?.isTrust
    ? sortedConfig.filter((wallet) => wallet.title !== 'WalletConnect')
    : sortedConfig
  const displayListConfig = showMore ? walletsToShow : walletsToShow.slice(0, displayCount)

  return (
    <StyledModalContainer minWidth={isMobile ? '238px' : '320px'}>
      <ModalHeader style={{ padding: isMobile ? '15px 15px 6px' : '12px 24px 6px' }}>
        <ModalTitle>
          <Text fontSize={[14, , , , 20]} color="BlackColor" fontWeight={isMobile ? '500' : '400'}>
            {t('Connect Wallet')}
          </Text>
        </ModalTitle>
        <ModalCloseButton
          onDismiss={onDismiss}
          iconColor="BlackColor"
          topIconButton={isMobile ? '8px' : '10px'}
          rightIconButton={isMobile ? '5px' : '12px'}
        />
      </ModalHeader>
      <ModalBody p={['0 15px', , , , '0 24px']} width={['auto', null, 'auto']}>
        <Text color="rgba(115, 115, 115, 1)" fontSize={[10]}>
          {`If you don't have a wallet, you can select a provider and create one now.`}
        </Text>
        <WalletWrapper>
          {displayListConfig.map((wallet) => (
            <Box key={wallet.title}>
              <WalletCard
                walletConfig={wallet}
                login={login}
                onDismiss={onDismiss}
                fontSize={isMobile ? '10px' : '14px'}
                fontColor="BlackColor"
              />
            </Box>
          ))}
          {/* {!showMore && <MoreWalletCard t={t} onClick={() => setShowMore(true)} />} */}
        </WalletWrapper>
      </ModalBody>
    </StyledModalContainer>
  )
}

export default ConnectModal
