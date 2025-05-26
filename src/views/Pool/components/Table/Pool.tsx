// import { Pair, JSBI, Percent } from '@madness-dex/sdk'
import { JSBI, Percent } from '@tabi-dex/sdk'
import React, { createElement } from 'react'
import { Box, useMatchBreakpoints } from 'packages/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useTokenBalance } from 'state/wallet/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { View } from 'views/Pool'
import PoolCell from './Cells/Pool.cell'
import TotalLpCell from './Cells/TotalLp.cell'
import ShareCell from './Cells/Share.cell'
import ActionCell from './Cells/Action.cell'

const Pool = ({ pair, view, index, ...props }) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const currency0 = unwrappedToken(pair?.token0)
  const currency1 = unwrappedToken(pair?.token1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const totalLpDisplay = view === View.ALL_POSITION ? totalPoolTokens : userPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const poolShareDisplay = poolTokenPercentage
    ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
    : `0.00`

  return (
    <>
      <tr>
        <td
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '1.5rem',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '400',
            color: 'white',
          }}
        >
          <Box>{index + 1}</Box>
        </td>
        <td style={{ paddingLeft: '1rem' }}>
          <PoolCell currency0={currency0} currency1={currency1} />
        </td>
        <td>
          <TotalLpCell total={totalLpDisplay?.toSignificant(6)} />
        </td>
        <td>
          <ShareCell share={poolShareDisplay} />
        </td>
        <td>
          <ActionCell currency0={currency0} currency1={currency1} view={view} />
        </td>
      </tr>
    </>
  )
}

export default Pool
