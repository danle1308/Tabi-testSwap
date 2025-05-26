import { useEffect, useMemo, useState, useRef } from 'react'
import { Trade, TradeType } from '@tabi-dex/sdk'
import {
  Button,
  Text,
  ErrorIcon,
  ArrowDownIcon,
  Flex,
  AutoRenewIcon,
  AutoRenewRedIcon,
  RefreshIcon,
  useMatchBreakpoints,
} from 'packages/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import styled from 'styled-components'
import { TruncatedText, SwapShowAcceptChanges, InputFromToSwap } from './styleds'

const AcceptButton = styled(Button)`
  width: auto;
  height: 20px;
  border-radius: 5px;
  box-shadow: none;
  margin-right: 1.2rem;
  font-size: 10px;
  font-weight: 400;
  color: var(--color-white-80);
  padding: 0 5px;

  &:disabled {
    box-shadow: none;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 25px;
    font-size: 12px;
  }
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  attemptingTxn,
  txHash,
  onDismiss,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  attemptingTxn: boolean
  txHash: string | undefined
  onDismiss: () => void
}) {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const amount =
    trade.tradeType === TradeType.EXACT_INPUT
      ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)
      : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)
  const symbol =
    trade.tradeType === TradeType.EXACT_INPUT ? trade.outputAmount.currency.symbol : trade.inputAmount.currency.symbol

  const tradeInfoText =
    trade.tradeType === TradeType.EXACT_INPUT
      ? t('Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.', {
          amount,
          symbol,
        })
      : t('Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.', {
          amount,
          symbol,
        })

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  // console.log('attemptingTxn', attemptingTxn)
  // console.log('txHash', txHash)

  const [check, setCheck] = useState<string | null>()

  useEffect(() => {
    if (txHash) {
      setTimeout(() => {
        onDismiss()
      }, 2000)
    }
  }, [txHash, onDismiss, check])

  return (
    <>
      <Flex flexDirection="column">
        <RowBetween>
          <Text p={isMobile ? '0.7rem 0 0.5rem 0' : '1rem 0 1rem 0'} fontSize={['14px', , , , '16px']} bold>
            Preview
          </Text>
          {showAcceptChanges ? (
            <AcceptButton onClick={onAcceptChanges} disabled={attemptingTxn}>
              {t('Price Updated')}
              <RefreshIcon width={12} ml="4px" />
            </AcceptButton>
          ) : null}
        </RowBetween>
        <AutoColumn gap="md">
          <AutoColumn>
            <Text fontWeight="300">You sell</Text>
            <InputFromToSwap align="center">
              <RowFixed gap="0px">
                {/* <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} /> */}
                <TruncatedText
                  bold
                  fontSize={['14px', , , , '20px']}
                  color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'text' : 'text'}
                >
                  {trade.inputAmount.toSignificant(6)}
                  {t(` `)}
                  {trade.inputAmount.currency.symbol}
                </TruncatedText>
              </RowFixed>
              <RowFixed gap="0px">
                <CurrencyLogo currency={trade.inputAmount.currency} size={isMobile ? '25px' : '45px'} />
                {/* <Text fontSize="14px" ml="10px" style={{ color: '#ffffff', opacity: 0.8 }}>
                  {trade.inputAmount.currency.symbol}
                </Text> */}
              </RowFixed>
            </InputFromToSwap>
          </AutoColumn>
          {/* <RowFixed>
            <ArrowDownIcon width="16px" ml="4px" />
          </RowFixed> */}
          <AutoColumn style={{ marginTop: isMobile ? '0rem' : '1rem' }}>
            <Text fontWeight="300">You receive</Text>
            <InputFromToSwap align="center">
              <RowFixed gap="0px">
                {/* <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} /> */}
                <TruncatedText
                  bold
                  fontSize={['14px', , , , '20px']}
                  color={
                    priceImpactSeverity > 2
                      ? 'text'
                      : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                      ? 'text'
                      : 'text'
                  }
                >
                  {trade.outputAmount.toSignificant(6)}
                  {t(` `)}
                  {trade.outputAmount.currency.symbol}
                </TruncatedText>
              </RowFixed>
              <RowFixed gap="0px">
                <CurrencyLogo currency={trade.outputAmount.currency} size={isMobile ? '25px' : '45px'} />
                {/* <Text fontSize="14px" ml="10px" style={{ color: '#ffffff', opacity: 0.8 }}>
                  {trade.outputAmount.currency.symbol}
                </Text> */}
              </RowFixed>
            </InputFromToSwap>
          </AutoColumn>
          {/* {showAcceptChanges ? (
            <SwapShowAcceptChanges justify="flex-start" gap="0px">
              <RowBetween>
                <RowFixed>
                  <ErrorIcon mr="8px" />
                  <Text bold> {t('Price Updated')}</Text>
                </RowFixed>
                <Button onClick={onAcceptChanges}>{t('Accept')}</Button>
              </RowBetween>
            </SwapShowAcceptChanges>
          ) : null} */}
          {/* <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
            <Text
              fontSize="12px"
              color="textSubtle"
              textAlign="left"
              style={{ width: '100%', color: 'rgba(255,255,255,0.8)' }}
            >
              {estimatedText}
              <b>
                {amount} {symbol}
              </b>
              {transactionRevertText}
            </Text>
          </AutoColumn> */}
          {recipient !== null ? (
            <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
              <Text color="textSubtle">
                {recipientSentToText}
                <b title={recipient}>{truncatedRecipient}</b>
                {postSentToText}
              </Text>
            </AutoColumn>
          ) : null}
        </AutoColumn>
      </Flex>
    </>
  )
}
