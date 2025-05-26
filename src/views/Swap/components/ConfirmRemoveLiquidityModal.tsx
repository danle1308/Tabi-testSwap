import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Pair, Percent, Token, TokenAmount, JSBI } from '@tabi-dex/sdk'
import { AddIcon, Button, CircleAddIcon, Flex, InjectedModalProps, Text, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { ApprovalState } from 'hooks/useApproveCallback'
import styled from 'styled-components'

interface ConfirmRemoveLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  pair?: Pair
  hash: string
  pendingText: string
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: CurrencyAmount
    [Field.CURRENCY_B]?: CurrencyAmount
  }
  allowedSlippage: number
  onRemove: () => void
  liquidityErrorMessage: string
  approval: ApprovalState
  signatureData?: any
  tokenA: Token
  tokenB: Token
  currencyA: Currency | null | undefined
  currencyB: Currency | null | undefined
  textScale?: string
}

// Placeholder constants for demonstration
const ZERO = JSBI.BigInt(0)

const ConfirmRemoveLiquidityModal: React.FC<InjectedModalProps & ConfirmRemoveLiquidityModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  pair,
  hash,
  approval,
  signatureData,
  pendingText,
  parsedAmounts,
  allowedSlippage,
  onRemove,
  liquidityErrorMessage,
  tokenA,
  tokenB,
  currencyA,
  currencyB,
  textScale,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const totalSupply = pair?.liquidityToken?.totalSupply
  const liquidityValueA = parsedAmounts[Field.LIQUIDITY]

  const poolShare =
    totalSupply && liquidityValueA ? new Percent(liquidityValueA.raw.toString(), totalSupply.raw.toString()) : undefined

  const tokenAperB = parsedAmounts[Field.CURRENCY_B]?.greaterThan(ZERO)
    ? parsedAmounts[Field.CURRENCY_A]?.divide(parsedAmounts[Field.CURRENCY_B])
    : undefined

  const tokenBperA = parsedAmounts[Field.CURRENCY_A]?.greaterThan(ZERO)
    ? parsedAmounts[Field.CURRENCY_B]?.divide(parsedAmounts[Field.CURRENCY_A])
    : undefined

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <Text fontSize={isMobile ? '12px' : '14px'} fontWeight="400" color="var(--color-white-80)">
          {t('You are removing')}
        </Text>
        <FlexBorder height={isMobile ? '150px' : '218px'} mb="1rem">
          <RowBetween height="50%" alignItems="center" padding="0 1.2rem">
            <RowFixed gap="4px">
              <Text fontSize={isMobile ? '14px' : '24px'}>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
              <Text fontSize={isMobile ? '14px' : '24px'} ml="10px">
                {currencyA?.symbol}
              </Text>
            </RowFixed>
            <CurrencyLogo currency={currencyA} size={isMobile ? '30px' : '45px'} />
          </RowBetween>
          <DividerWithPlus>
            <CircleAddIcon />
          </DividerWithPlus>
          <RowBetween height="50%" alignItems="center" padding="0 1.2rem">
            <RowFixed gap="4px">
              <Text fontSize={isMobile ? '14px' : '24px'}>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
              <Text fontSize={isMobile ? '14px' : '24px'} ml="10px">
                {currencyB?.symbol}
              </Text>
            </RowFixed>
            <CurrencyLogo currency={currencyB} size={isMobile ? '30px' : '45px'} />
          </RowBetween>
        </FlexBorder>
      </AutoColumn>
    )
  }, [parsedAmounts, currencyA, currencyB, t])

  const modalBottom = useCallback(() => {
    // const { isMobile } = useMatchBreakpoints()

    return (
      <>
        {/* <RowBetween>
          <Text fontSize={[14]}>
            {t('%assetA%/%assetB% Burned', {
              assetA: currencyA?.symbol ?? '',
              assetB: currencyB?.symbol ?? '',
            })}
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <Text fontSize={[14]}>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween> */}

        <RowBetween>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '400' }}>
            Pool
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '700' }}>
            {currencyA?.symbol}/{currencyB?.symbol}
          </Text>
        </RowBetween>

        <RowBetween>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '400' }}>
            {currencyA?.symbol} per {currencyB?.symbol}
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '700' }}>
            {tokenAperB?.toSignificant(6) ?? '0.000'}
          </Text>
        </RowBetween>

        <RowBetween>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '400' }}>
            {currencyB?.symbol} per {currencyA?.symbol}
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '700' }}>
            {tokenBperA?.toSignificant(6) ?? '0.000'}
          </Text>
        </RowBetween>

        <RowBetween>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '400' }}>
            Share of Pool
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', color: 'var(--color-white-80)', fontWeight: '700' }}>
            {poolShare ? `${poolShare.toFixed(2)}%` : '0.00%'}
          </Text>
        </RowBetween>

        {pair && (
          <>
            <RowBetween>
              <Text>{t('Price')}</Text>
              <Text>
                1 {currencyA?.symbol} = {pair.priceOf(tokenA)?.toSignificant(6) ?? '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <Text>
                1 {currencyB?.symbol} = {pair.priceOf(tokenB)?.toSignificant(6) ?? '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}

        <Button
          width="100%"
          mt="20px"
          fontFamily="Modak"
          fontSize={isMobile ? '12px' : '19px'}
          fontWeight="400"
          color="white"
          height={isMobile ? '30px' : '48px'}
          disabled={!(approval === ApprovalState.APPROVED || signatureData)}
          onClick={onRemove}
        >
          {t('Confirm')}
        </Button>
      </>
    )
  }, [
    currencyA,
    currencyB,
    parsedAmounts,
    approval,
    onRemove,
    pair,
    signatureData,
    tokenA,
    tokenB,
    tokenAperB,
    tokenBperA,
    poolShare,
    t,
  ])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [liquidityErrorMessage, onDismiss, modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
      textScale={textScale}
    />
  )
}

export default ConfirmRemoveLiquidityModal

const FlexBorder = styled(Flex)`
  flex-direction: column;
  border: 1px solid rgba(250, 250, 250, 0.45);
  border-radius: 10px;
`

const DividerWithPlus = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(250, 250, 250, 0.45);
  }
`
