import React, { useCallback, useEffect } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent, Token, TokenAmount } from '@tabi-dex/sdk'
import { CircleAddIcon, Flex, InjectedModalProps, Text, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
// import Row from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import styled from 'styled-components'
import ConfirmAddModalBottom from '../../AddLiquidity/ConfirmAddModalBottom'

interface ConfirmAddLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity: boolean
  allowedSlippage: number
  liquidityErrorMessage: string
  price: Fraction
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  onAdd: () => void
  poolTokenPercentage: Percent
  liquidityMinted: TokenAmount
  currencyToAdd: Token
  textScale?: string
  hash: string
  txHash?: string
  // maxWidth?: string
}

const ConfirmAddLiquidityModal: React.FC<InjectedModalProps & ConfirmAddLiquidityModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  hash,
  pendingText,
  price,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
  textScale,
  attemptingTxn,
  txHash,
  // maxWidth,
  // ...props
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    if (txHash) {
      setTimeout(() => {
        onDismiss()
      }, 2000)
    }
  }, [txHash, onDismiss])

  const modalHeader = useCallback(() => {
    return noLiquidity ? (
      <Flex alignItems="center">
        <Text fontSize="32px">{`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}</Text>
        <DoubleCurrencyLogo
          currency0={currencies[Field.CURRENCY_A]}
          currency1={currencies[Field.CURRENCY_B]}
          size={30}
        />
      </Flex>
    ) : (
      <AutoColumn>
        <FlexBorder height={isMobile ? '150px' : '218px'} mb="1rem">
          <Flex height="50%" alignItems="center" px="1.2rem" justifyContent="space-between">
            <InfoText>
              {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} {currencies[Field.CURRENCY_A]?.symbol}
            </InfoText>
            {/* <Text fontSize={['24px', , , , '32px']}>{liquidityMinted?.toSignificant(6)}</Text> */}
            {/* <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            /> */}
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size={isMobile ? '30px' : '45px'} />
          </Flex>
          <DividerWithPlus>
            <CircleAddIcon />
          </DividerWithPlus>
          <Flex height="50%" alignItems="center" px="1.2rem" justifyContent="space-between">
            <InfoText>
              {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} {currencies[Field.CURRENCY_B]?.symbol}
            </InfoText>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size={isMobile ? '30px' : '45px'} />
            {/* <Text fontSize={['24px', , , , '32px']}>{liquidityMinted?.toSignificant(6)}</Text> */}
            {/* <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            /> */}
            {/* <Row>
              <Text>{`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}</Text>
            </Row>
            <Text fontSize={[12, , , , 14]} color="WhiteColorLight" textAlign="left" py="12px">
              {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
                slippage: allowedSlippage / 100,
              })}
            </Text> */}
          </Flex>
        </FlexBorder>
        <Text fontSize={[10, , , , 14]} color="#FDF164" textAlign="left" py="5px">
          {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
            slippage: allowedSlippage / 100,
          })}
        </Text>
      </AutoColumn>
    )
  }, [currencies, liquidityMinted, allowedSlippage, noLiquidity, t, onDismiss])

  const modalBottom = useCallback(() => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        onDismiss={onDismiss}
      />
    )
  }, [currencies, noLiquidity, onAdd, parsedAmounts, poolTokenPercentage, price, onDismiss, txHash, attemptingTxn])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, liquidityErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
      textScale={textScale}
    />
  )
}

export default ConfirmAddLiquidityModal

const FlexBorder = styled(Flex)`
  flex-direction: column;
  border: 1px solid rgba(250, 250, 250, 0.45);
  border-radius: 10px;
`

const DividerWithPlus = styled.div`
  display: flex;
  align-items: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(250, 250, 250, 0.45);
  }

  &::before {
    /* margin-right: 8px; */
  }

  &::after {
    /* margin-left: 8px; */
  }
`

const InfoText = styled(Text).attrs({ fontSize: [20] })`
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`
