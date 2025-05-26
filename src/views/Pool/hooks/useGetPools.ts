import { useMemo } from 'react'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { PairState, usePairs } from 'hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

export const useGetPools = () => {
  const { account } = useActiveWeb3React()

  const trackedTokenPairs = useTrackedTokenPairs()
  // const trackedTokenPairs = []

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  // console.log('liquidityTokens', liquidityTokens)

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // console.log('v2PairsBalances', v2PairsBalances)
  const v2AllPairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

  const liquidityTokensWithBalances = useMemo(
    () =>
      account
        ? tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
            v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
          )
        : [],
    [tokenPairsWithLiquidityTokens, v2PairsBalances, account],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2AllPairs?.length < tokenPairsWithLiquidityTokens.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING)) ||
    (v2AllPairs?.length && v2AllPairs.every(([pairState]) => pairState === PairState.LOADING))

  const allV2Pairs = v2AllPairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  return {
    allV2PairsWithLiquidity,
    allV2Pairs,
    v2IsLoading,
  }
}
