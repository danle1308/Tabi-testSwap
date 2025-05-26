import { Currency, Percent, Price } from '@tabi-dex/sdk'
import { Text, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from '../../components/Layout/Column'
import { AutoRow } from '../../components/Layout/Row'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <AutoColumn
      style={{
        height: '100%',
        border: '0.5px solid var(--color-white-50)',
        borderRadius: '5px',
        padding: '13px',
        minHeight: isMobile ? 'auto' : '128px',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
      gap="md"
    >
      <AutoRow style={{ display: 'flex', flexDirection: 'column', marginBottom: '0', justifyContent: 'space-between' }}>
        <AutoColumn
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400', color: 'var(--color-white-80)' }}>
            Pool
          </Text>
          <Text
            style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700', color: 'var(--color-white-80)' }}
            pt={1}
          >
            {t('%assetA%/%assetB%', {
              assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
              assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
            })}
          </Text>
        </AutoColumn>
        <AutoColumn
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400', color: 'var(--color-white-80)' }}
            pt={1}
          >
            {t('%assetA% per %assetB%', {
              assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
              assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
            })}
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700', color: 'var(--color-white-80)' }}>
            {price?.toSignificant(6) ?? '-'}
          </Text>
        </AutoColumn>
        <AutoColumn
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400', color: 'var(--color-white-80)' }}
            pt={1}
          >
            {t('%assetA% per %assetB%', {
              assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
              assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
            })}
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700', color: 'var(--color-white-80)' }}>
            {price?.invert()?.toSignificant(6) ?? '-'}
          </Text>
        </AutoColumn>
        <AutoColumn
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400', color: 'var(--color-white-80)' }}
            pt={1}
          >
            {t('Share of Pool')}
          </Text>
          <Text style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700', color: 'var(--color-white-80)' }}>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
