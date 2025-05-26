import { Currency, CurrencyAmount, Fraction, Percent, Trade } from '@tabi-dex/sdk'
import { Text, Button, useMatchBreakpoints, LoadingIcon } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { UIButton } from 'components/TabiSwap/components/ui'
import styled from 'styled-components'
import { LightCard } from 'components/Card'
import { StyledUIButton } from 'views/Swap/styles'
import { AutoRow, RowBetween, RowFixed } from '../../components/Layout/Row'
import { CurrencyLogo } from '../../components/Logo'
import { Field } from '../../state/mint/actions'

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
  txHash,
  onConfirm,
  trade,
  allowedSlippage,
  disabledConfirm,
  attemptingTxn,
}: {
  trade: Trade
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
  txHash: string | undefined
  onConfirm: () => void
  allowedSlippage: number
  disabledConfirm: boolean
  attemptingTxn: boolean
  // lpTokens?: CurrencyAmount
}) {
  console.log('attemptingTxn', attemptingTxn)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <InforWrapper>
        <RowBetween mb="5px">
          {/* <InfoText>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}</InfoText> */}
          <InfoText>{t('Pool')}</InfoText>
          <InfoText fontWeight="700">
            {currencies[Field.CURRENCY_A]?.symbol}/{currencies[Field.CURRENCY_B]?.symbol}
          </InfoText>
          {/* <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <InfoText>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</InfoText>
          </RowFixed> */}
        </RowBetween>
        {/* <RowBetween mb="5px">
          <InfoText>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}</InfoText>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <InfoText>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</InfoText>
          </RowFixed>
        </RowBetween> */}
        <RowBetween mb="5px">
          <InfoText>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </InfoText>
          <InfoText fontWeight="700">{price?.toSignificant(4)}</InfoText>
          {/* <InfoText>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </InfoText> */}
        </RowBetween>
        <RowBetween mb="5px">
          <InfoText>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </InfoText>
          <InfoText fontWeight="700">{price?.invert().toSignificant(4)}</InfoText>
          {/* <InfoText>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </InfoText> */}
        </RowBetween>
        <RowBetween mb="5px">
          <InfoText>{t('Share of Pool')}:</InfoText>
          <InfoText fontWeight="700">{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</InfoText>
        </RowBetween>
      </InforWrapper>

      {/* <Button
        height={isMobile ? '38px' : '48px'}
        variant={noLiquidity ? 'primary' : 'primary'}
        style={{
          width: '100%',
          marginTop: '10px',
          fontFamily: 'Modak',
          fontSize: isMobile ? '12px' : '19px',
          marginBottom: '5px',
        }}
        disabled={disabledConfirm || attemptingTxn}
        onClick={() => {
          onAdd()
        }}
      >
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm')}
        <LoadingIcon />
      </Button> */}
      <AutoRow position="relative">
        <StyledUIButton
          variant={noLiquidity ? 'primary' : 'primary'}
          onClick={() => {
            onAdd()
          }}
          disabled={disabledConfirm || attemptingTxn}
          id="confirm-swap-or-send"
          width="100%"
          style={{
            fontSize: isMobile ? '12px' : '19px',
            borderRadius: '30px',
            color: 'white',
            height: isMobile ? '38px' : '48px',
            width: '100%',
            marginTop: '10px',
            fontFamily: 'Modak',
            marginBottom: '5px',
          }}
        >
          {noLiquidity ? t('Create Pool & Supply') : t('Confirm')}
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
      </AutoRow>
    </>
  )
}

export default ConfirmAddModalBottom

const InforWrapper = styled(LightCard)`
  padding: 10px 0px;
  background: transparent;
`

const InfoText = styled(Text).attrs({ fontSize: [14] })`
  color: var(--color-white-80);

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 10px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`
