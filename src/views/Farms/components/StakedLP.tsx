import { Heading, Flex, Text } from 'packages/uikit'
import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { useCallback } from 'react'
import { useLpTokenPrice } from 'state/farms/hooks'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

interface StackedLPProps {
  stakedBalance: BigNumber
  lpSymbol: string
  tokenSymbol: string
  quoteTokenSymbol: string
  lpTotalSupply: BigNumber
  tokenAmountTotal: BigNumber
  quoteTokenAmountTotal: BigNumber
}

const StakedLP: React.FunctionComponent<StackedLPProps> = ({
  stakedBalance,
  lpSymbol,
  quoteTokenSymbol,
  tokenSymbol,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const lpPrice = useLpTokenPrice(lpSymbol)

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Text color={stakedBalance.eq(0) ? 'black' : 'black'}>{displayBalance()}</Text>
      {stakedBalance.gt(0) && lpPrice.gt(0) && (
        <>
          <Balance
            fontSize="12px"
            color="black"
            style={{ opacity: 0.4 }}
            decimals={2}
            value={getBalanceNumber(lpPrice.times(stakedBalance))}
            unit=" USD"
            prefix="~"
          />
          <Flex style={{ gap: '4px' }}>
            <Balance
              fontSize="12px"
              color="black"
              style={{ opacity: 0.4 }}
              decimals={2}
              value={stakedBalance.div(lpTotalSupply).times(tokenAmountTotal).toNumber()}
              unit={` ${tokenSymbol}`}
            />
            <span style={{ color: '#fff', opacity: '0.4' }}>-</span>
            <Balance
              fontSize="12px"
              color="black"
              style={{ opacity: 0.4 }}
              decimals={2}
              value={stakedBalance.div(lpTotalSupply).times(quoteTokenAmountTotal).toNumber()}
              unit={` ${quoteTokenSymbol}`}
            />
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default StakedLP
