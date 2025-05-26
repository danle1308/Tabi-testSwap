import BN from 'bignumber.js'
import { BigNumber } from '@ethersproject/bignumber'
import _toString from 'lodash/toString'
import { BLOCKS_PER_YEAR } from 'config'
import masterChefAbi from 'config/abi/WAGFarm.json'
import { useCallback, useMemo } from 'react'
import { useCakeVault } from 'state/pools/hooks'
import useSWRImmutable from 'swr/immutable'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { BOOST_WEIGHT, DURATION_FACTOR, MAX_LOCK_DURATION } from 'config/constants/pools'
import { multicallv2 } from '../utils/multicall'

const masterChefAddress = getMasterChefAddress()

// default
const DEFAULT_PERFORMANCE_FEE_DECIMALS = 2

const PRECISION_FACTOR = new BN('1000000000000')
const WeiPerEther = new BN('1000000000000000000')

const getFlexibleApy = (totalCakePoolEmissionPerYear: BN, pricePerFullShare: BN, totalShares: BN) =>
  totalCakePoolEmissionPerYear.times(WeiPerEther).div(pricePerFullShare).div(totalShares).times(100)

const _getBoostFactor = (boostWeight: BigNumber, duration: number, durationFactor: BigNumber) => {
  return new BN(boostWeight.toString())
    .times(new BN(Math.max(duration, 0)))
    .div(new BN(durationFactor.toString()))
    .div(PRECISION_FACTOR)
}

const getLockedApy = (flexibleApy: string, boostFactor: BN) => new BN(flexibleApy).times(boostFactor.plus(1))

const cakePoolPID = 0

export function useVaultApy({ duration = MAX_LOCK_DURATION }: { duration?: number } = {}) {
  const {
    totalShares = BIG_ZERO,
    pricePerFullShare = BIG_ZERO,
    fees: { performanceFeeAsDecimal } = { performanceFeeAsDecimal: DEFAULT_PERFORMANCE_FEE_DECIMALS },
  } = useCakeVault()

  const totalSharesAsEtherBN = useMemo(() => new BN(totalShares.toString()), [totalShares])
  const pricePerFullShareAsEtherBN = useMemo(() => new BN(pricePerFullShare.toString()), [pricePerFullShare])

  const { data: totalCakePoolEmissionPerYear } = useSWRImmutable('masterChef-total-cake-pool-emission', async () => {
    const calls = [
      {
        address: masterChefAddress,
        name: 'cakePerSecond',
        params: [false],
      },
      {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [cakePoolPID],
      },
      {
        address: masterChefAddress,
        name: 'totalSpecialAllocPoint',
      },
    ]

    const [[specialFarmsPerBlock], cakePoolInfo, [totalSpecialAllocPoint]] = await multicallv2(masterChefAbi, calls)

    const cakePoolSharesInSpecialFarms = new BN(cakePoolInfo.allocPoint.toString()).div(
      new BN(totalSpecialAllocPoint.toString()),
    )
    return new BN(specialFarmsPerBlock.toString()).times(BLOCKS_PER_YEAR).times(cakePoolSharesInSpecialFarms)
  })

  const flexibleApy = useMemo(
    () =>
      totalCakePoolEmissionPerYear &&
      !pricePerFullShareAsEtherBN.isZero() &&
      !totalSharesAsEtherBN.isZero() &&
      getFlexibleApy(totalCakePoolEmissionPerYear, pricePerFullShareAsEtherBN, totalSharesAsEtherBN).toString(),
    [pricePerFullShareAsEtherBN, totalCakePoolEmissionPerYear, totalSharesAsEtherBN],
  )

  const boostFactor = useMemo(() => _getBoostFactor(BOOST_WEIGHT, duration, DURATION_FACTOR), [duration])

  const lockedApy = useMemo(() => {
    return flexibleApy && getLockedApy(flexibleApy, boostFactor).toString()
  }, [boostFactor, flexibleApy])

  const getBoostFactor = useCallback(
    (adjustDuration: number) => _getBoostFactor(BOOST_WEIGHT, adjustDuration, DURATION_FACTOR),
    [],
  )

  const flexibleApyNoFee = useMemo(() => {
    if (flexibleApy && performanceFeeAsDecimal) {
      const rewardPercentageNoFee = _toString(1 - performanceFeeAsDecimal / 100)

      return new BN(flexibleApy).times(rewardPercentageNoFee).toString()
    }

    return flexibleApy
  }, [flexibleApy, performanceFeeAsDecimal])

  return {
    flexibleApy: flexibleApyNoFee,
    lockedApy,
    getLockedApy: useCallback(
      (adjustDuration: number) => flexibleApy && getLockedApy(flexibleApy, getBoostFactor(adjustDuration)).toString(),
      [flexibleApy, getBoostFactor],
    ),
    boostFactor: useMemo(() => boostFactor.plus('1'), [boostFactor]),
    getBoostFactor: useCallback((adjustDuration: number) => getBoostFactor(adjustDuration).plus('1'), [getBoostFactor]),
  }
}
