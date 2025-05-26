import { Percent } from '@tabi-dex/sdk'
import { warningSeverity } from 'utils/prices'
import { ONE_BIPS } from '../../../config/constants'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  return (
    <ErrorText
      style={{ color: 'var(--color-white-80)' }}
      fontSize={['10px', , , , '14px']}
      fontWeight="700"
      severity={warningSeverity(priceImpact)}
    >
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
