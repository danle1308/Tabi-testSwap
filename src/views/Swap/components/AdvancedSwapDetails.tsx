import { Trade, TradeType } from '@tabi-dex/sdk'
import { Text } from 'packages/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { TradeTextColor } from './styleds'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { t } = useTranslation()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <AutoColumn style={{ gap: '0.5rem' }}>
      <RowBetween>
        <RowFixed>
          <TradeTextColor fontWeight="400">{t('Price Impact')}</TradeTextColor>
          {/* <QuestionHelper
            text={t('The difference between the market price and estimated price due to trade size.')}
            ml="4px"
            placement="top-start"
          /> */}
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <TradeTextColor fontWeight="400">{isExactIn ? t('Min. received') : t('Maximum sold')}</TradeTextColor>
          {/* <QuestionHelper
            text={t(
              'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
            )}
            ml="4px"
            placement="top-start"
          /> */}
        </RowFixed>
        <RowFixed>
          <TradeTextColor bold>
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </TradeTextColor>
        </RowFixed>
      </RowBetween>

      <RowBetween align="center">
        <TradeTextColor>{t('Slippage Tolerance')}</TradeTextColor>
        <TradeTextColor style={{ color: `var(--color-white-80)` }} bold>
          {allowedSlippage / 100}%
        </TradeTextColor>
      </RowBetween>

      {/* <RowBetween>
        <RowFixed>
          <TradeTextColor fontSize="14px" color="textSubtle">
            {t('Liquidity Provider Fee')}
          </TradeTextColor>
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
            placement="top-start"
          />
        </RowFixed>
        <TradeTextColor fontSize="14px">
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </TradeTextColor>
      </RowBetween> */}
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length >= 2)

  return (
    <AutoColumn>
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween mt="0.4rem">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <TradeTextColor color="textSubtle">{t('Routing source')}</TradeTextColor>
                  {/* <QuestionHelper
                    text={t('Routing through these tokens resulted in the best price for your trade.')}
                    ml="4px"
                    placement="top-start"
                  /> */}
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
