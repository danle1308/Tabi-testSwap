import { Price } from '@tabi-dex/sdk'
import { Text, AutoRenewIcon, AutoRenewRedIcon, useMatchBreakpoints } from 'packages/uikit'
import { StyledBalanceMaxMini, TradeTextColor } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)
  const { isMobile } = useMatchBreakpoints()

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} = 1 ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} = 1 ${price?.quoteCurrency?.symbol}`

  return (
    <TradeTextColor style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <AutoRenewRedIcon width={isMobile ? '9px' : '12px'} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </TradeTextColor>
  )
}
