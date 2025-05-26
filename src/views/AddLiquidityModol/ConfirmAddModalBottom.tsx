import { Currency, CurrencyAmount, Fraction, Percent } from '@tabi-dex/sdk'
import { Text, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { UIButton } from 'components/TabiSwap/components/ui'
import styled from 'styled-components'
import { LightCard } from 'components/Card'
import { Field } from 'state/mint/actions'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
// import { RowBetween, RowFixed } from '../../components/Layout/Row'
// import { CurrencyLogo } from '../../components/Logo'
// import { Field } from '../../state/mint/actions'

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <InforWrapper>
        <RowBetween mb="5px">
          <InfoText>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}</InfoText>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <InfoText>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</InfoText>
          </RowFixed>
        </RowBetween>
        <RowBetween mb="5px">
          <InfoText>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}</InfoText>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <InfoText>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</InfoText>
          </RowFixed>
        </RowBetween>
        <RowBetween mb="5px">
          <InfoText>{t('Rates')}</InfoText>
          <InfoText>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </InfoText>
        </RowBetween>
        <RowBetween mb="5px" style={{ justifyContent: 'flex-end' }}>
          <InfoText>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </InfoText>
        </RowBetween>
        <RowBetween mb="5px">
          <InfoText>{t('Share of Pool')}:</InfoText>
          <InfoText>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</InfoText>
        </RowBetween>
      </InforWrapper>

      <UIButton.UIStyledActionButton style={{ width: '100%', marginTop: '20px' }} onClick={onAdd}>
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </UIButton.UIStyledActionButton>
    </>
  )
}

export default ConfirmAddModalBottom

const InforWrapper = styled(LightCard)`
  padding: 12px 24px;
`

const InfoText = styled(Text).attrs({ fontSize: [12] })``
