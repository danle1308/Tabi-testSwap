import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from '@tabi-dex/sdk'
import { Button, Text, AutoRenewIcon, LoadingIcon, Box, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { Field } from 'state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError, InformationText } from './styleds'
import { StyledUIButton } from '../styles'
import SwapRoute from './SwapRoute'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 1.5rem;
  /* padding: 16px; */
  border-radius: 8px;
  row-gap: 10px;
  /* border: 1px solid ${({ theme }) => theme.colors.cardBorder}; */
  /* background-color: ${({ theme }) => theme.colors.InvertedContrastColor}; */
`

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  attemptingTxn,
  txHash,
  onDismiss,
  isDisabled,
  setIsDisabled,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  onDismiss: () => void
  isDisabled?: any
  setIsDisabled?: any
}) {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  // console.log('disabledConfirm', disabledConfirm)

  // useEffect(() => {

  // }, )

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween>
          <RowFixed>
            <InformationText>{t('Price Impact')}</InformationText>
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        {/* <RowBetween align="center">
          <InformationText>{t('Price')}</InformationText>
          <InformationText
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </InformationText>
        </RowBetween> */}

        <RowBetween>
          <RowFixed>
            <InformationText>
              {trade.tradeType === TradeType.EXACT_INPUT ? t('Min. received') : t('Maximum sold')}
            </InformationText>
            {/* <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
            /> */}
          </RowFixed>
          <RowFixed>
            <InformationText bold>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </InformationText>
            <InformationText marginLeft="4px" bold>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </InformationText>
          </RowFixed>
        </RowBetween>

        <RowBetween align="center">
          <InformationText>{t('Slippage Tolerance')}</InformationText>
          <InformationText bold>{allowedSlippage / 100}%</InformationText>
        </RowBetween>

        <RowBetween>
          <InformationText>{t('Routing source')}</InformationText>
          <SwapRoute trade={trade} />
        </RowBetween>
        {/* <RowBetween>
          <RowFixed>
            <InformationText>{t('Price Impact')}</InformationText>
            <QuestionHelper
              text={t('The difference between the market price and your price due to trade size.')}
              ml="4px"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween> */}
        {/* <RowBetween>
          <RowFixed>
            <InformationText>{t('Liquidity Provider Fee')}</InformationText>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: '0.25%' })}</Text>
                  <Text>- {t('%amount% to LP token holders', { amount: '0.17%' })}</Text>
                  <Text>- {t('%amount% to the Treasury', { amount: '0.03%' })}</Text>
                  <Text>- {t('%amount% towards VEN buyback and burn', { amount: '0.05%' })}</Text>
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <InformationText>
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </InformationText>
        </RowBetween> */}
      </SwapModalFooterContainer>

      <AutoRow position="relative">
        <StyledUIButton
          variant={severity > 2 ? 'primary' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm || attemptingTxn || isDisabled === true}
          // disabled={disabledConfirm || attemptingTxn}
          // isLoading
          mt={isMobile ? '15px' : '20px'}
          id="confirm-swap-or-send"
          width="100%"
          style={{
            fontSize: isMobile ? '16px' : '19px',
            borderRadius: '30px',
            color: 'white',
            height: isMobile ? '38px' : '48px',
          }}
        >
          {severity > 2 ? t('Swap Anyway') : t('Confirm')}
          <style>
            {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
          </style>
          {attemptingTxn && (
            <LoadingIcon
              style={{
                position: 'absolute',
                right: isMobile ? '20px' : '25px',
                width: isMobile ? '15px' : '25px',
                animation: attemptingTxn ? 'spin 1s linear infinite' : null,
              }}
            />
          )}
        </StyledUIButton>
        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
      {disabledConfirm ? (
        <Text
          mt="1.2rem"
          mb={isMobile ? '5px' : '0px'}
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontWeight: '400',
            color: '#FDF164C2',
            fontSize: isMobile ? '10px' : '14px',
          }}
        >
          {t(`Please accept price updated first.`)}
        </Text>
      ) : null}
    </>
  )
}
