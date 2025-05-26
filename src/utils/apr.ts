import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  // stakingAddress: string,
  // rewardAddress: string,
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  // const totalRewardPricePerYear =
  //   stakingAddress === rewardAddress
  //     ? new BigNumber('1').times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  //     : new BigNumber('0.01').times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  // console.log('🚀 ~ file: apr.ts:20 ~ totalRewardPricePerYear:', Number(totalRewardPricePerYear))
  // const totalStakingTokenInPool = new BigNumber('1').times(totalStaked)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  // console.log('🚀 ~ file: apr.ts:22 ~ totalStakingTokenInPool:', Number(totalStakingTokenInPool))
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100) // totalRewardPricePerYear / totalStakingTokenInPool = apr
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  regularCakePerBlock: number,
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  const yearlyCakeRewardAllocation = poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularCakePerBlock)
    : new BigNumber(NaN)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  // console.log('🚀 ~ file: apr.ts:46 ~ cakeRewardsApr:', Number(cakePriceUsd))
  // console.log('🚀 ~ file: apr.ts:46 ~ poolLiquidityUsd:', Number(poolLiquidityUsd))
  let cakeRewardsAprAsNumber = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

export default null
