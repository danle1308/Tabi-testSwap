import { Fragment, memo } from 'react'
import { Trade } from '@tabi-dex/sdk'
import { Text, Flex, ChevronRightIcon } from 'packages/uikit'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { TradeTextColor } from './styleds'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  return (
    <Flex flexWrap="wrap" width="auto" justifyContent="flex-end" alignItems="center">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        const currency = unwrappedToken(token)
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <Flex alignItems="end">
              <TradeTextColor fontSize="14px" bold ml="0.1rem" mr="0.1rem">
                {currency.symbol}
              </TradeTextColor>
            </Flex>
            {!isLastItem && <ChevronRightIcon width="14px" />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
