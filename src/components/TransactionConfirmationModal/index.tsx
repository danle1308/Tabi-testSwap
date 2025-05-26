import { useCallback, useEffect } from 'react'
import { ChainId, Currency, Token } from '@tabi-dex/sdk'
import styled from 'styled-components'
import {
  Button,
  Text,
  ErrorIcon,
  ArrowUpIcon,
  MetamaskIcon,
  Flex,
  Box,
  Link,
  Spinner,
  Modal,
  InjectedModalProps,
  ModalHeader,
  useMatchBreakpoints,
} from 'packages/uikit'
import { registerToken } from 'utils/wallet'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { WrappedTokenInfo } from 'state/types'
import { UIButton } from 'components/TabiSwap/components/ui/Button'
import { RowFixed } from '../Layout/Row'
import { AutoColumn, ColumnCenter } from '../Layout/Column'
import { getBscScanLink } from '../../utils'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 12px 0 0;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 0 0 24px;
`

const ConfirmTextColor = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
`

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <ConfirmedIcon>
        {/* <Spinner /> */}
        <Box maxWidth={[135]}>
          <img src="/images/loading.gif" alt="animation" />
        </Box>
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <ConfirmTextColor fontSize="14px">{t('Waiting For Confirmation')}</ConfirmTextColor>
        <AutoColumn gap="12px" justify="center">
          <ConfirmTextColor bold small textAlign="center">
            {pendingText}
          </ConfirmTextColor>
        </AutoColumn>
        <ConfirmTextColor fontSize="14px" color="textSubtle" textAlign="center">
          {t('Confirm this transaction in your wallet')}
        </ConfirmTextColor>
      </AutoColumn>
    </Wrapper>
  )
}

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const { library } = useActiveWeb3React()

  const { t } = useTranslation()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          {/* <ArrowUpIcon strokeWidth={0.5} width="90px" color="primary" /> */}
          <Flex maxWidth="111px" width="100%" mx="auto">
            <img src="/images/tx-success.png" alt="" />
          </Flex>
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <ConfirmTextColor bold fontSize="14px">
            {t('Transaction Submitted')}
          </ConfirmTextColor>
          {chainId && hash && (
            <Link
              external
              fontSize="14px"
              style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}
              href={getBscScanLink(hash, 'transaction', chainId)}
            >
              {t('View on Explorer')}
            </Link>
          )}

          <Button width="100%" onClick={onDismiss} mt="12px">
            {t('Close')}
          </Button>

          {currencyToAdd && library?.provider?.isMetaMask && (
            <UIButton.UIStyledActionButton
              variant="tertiary"
              mt="12px"
              width="fit-content"
              onClick={() =>
                registerToken(
                  token.address,
                  token.symbol,
                  token.decimals,
                  token instanceof WrappedTokenInfo ? token.logoURI : undefined,
                )
              }
              style={{
                backgroundColor: '#323436',
                color: '#ffffff',
                fontWeight: '500',
              }}
            >
              <RowFixed>
                {t('Add %asset% to Metamask', { asset: currencyToAdd.symbol })}
                <MetamaskIcon width="22px" ml="6px" />
              </RowFixed>
            </UIButton.UIStyledActionButton>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Box>{topContent()}</Box>
      <Box>{bottomContent()}</Box>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn justify="center" gap="md">
        <ErrorIcon color="failure" width="64px" />
        <ConfirmTextColor
          color="failure"
          style={{ textAlign: 'center', width: '85%', wordBreak: 'break-word', marginBottom: '16px' }}
        >
          {message}
        </ConfirmTextColor>
      </AutoColumn>

      <Flex justifyContent="center" pt="10px">
        <UIButton.UIStyledActionButton width="100%" onClick={onDismiss}>
          {t('Dismiss')}
        </UIButton.UIStyledActionButton>
      </Flex>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
  textScale?: string
  bodyPadding?: string
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
  textScale,
  bodyPadding,
  ...props
}) => {
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <StyledModal
      title={title}
      headerBackground="gradients.cardHeader"
      onDismiss={handleDismiss}
      // textScale={textScale}
      maxWidth={isMobile ? '238px' : '414px'}
      textScale={isMobile ? 'xss' : 'xs'}
      bodyPadding={bodyPadding}
      {...props}
    >
      {/* {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={handleDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )} */}
      {content()}
    </StyledModal>
  )
}

export default TransactionConfirmationModal

const StyledModal = styled(Modal)`
  /* height: 68%; */
  > ${ModalHeader} {
    background: unset !important;
  }
`
