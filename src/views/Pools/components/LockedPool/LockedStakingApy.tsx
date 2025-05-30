import { useMemo, memo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { Flex, Text, Box, TooltipText, useTooltip } from 'packages/uikit'
import { LightCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { BalanceWithLoading } from 'components/Balance'
import Divider from 'components/Divider'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import BurningCountDown from './Common/BurningCountDown'
import LockedActions from './Common/LockedActions'
import YieldBoostRow from './Common/YieldBoostRow'
import LockDurationRow from './Common/LockDurationRow'
import useUserDataInVaultPresenter from './hooks/useUserDataInVaultPresenter'
import { LockedStakingApyPropsType } from './types'

const LockedStakingApy: React.FC<LockedStakingApyPropsType> = ({ stakingToken, stakingTokenBalance, userData }) => {
  const { t } = useTranslation()
  const position = useMemo(
    () =>
      getVaultPosition({
        userShares: userData?.userShares,
        locked: userData?.locked,
        lockEndTime: userData?.lockEndTime,
      }),
    [userData],
  )

  const currentLockedAmountAsBigNumber = useMemo(() => {
    return userData?.balance?.cakeAsBigNumber
  }, [userData?.balance?.cakeAsBigNumber])

  const currentLockedAmount = getBalanceNumber(currentLockedAmountAsBigNumber)

  const usdValueStaked = useBUSDCakeAmount(currentLockedAmount)

  const { weekDuration, lockEndDate, secondDuration, remainingTime } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime,
    lockEndTime: userData?.lockEndTime,
  })

  const { lockedApy } = useVaultApy({ duration: secondDuration })

  // earningTokenBalance includes overdue fee if any
  const earningTokenBalance = useMemo(() => {
    return getBalanceNumber(currentLockedAmountAsBigNumber.minus(userData?.cakeAtLastUserAction))
  }, [currentLockedAmountAsBigNumber, userData?.cakeAtLastUserAction])

  const tooltipContent = t(
    'Calculated based on current rates and subject to change based on pool conditions. It is an estimate provided for your conTABIience only, and by no means represents guaranteed returns.',
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  return (
    <BodyCard>
      <Flex justifyContent="space-between" mb="16px">
        <Flex flexDirection="column" flex="1">
          <Text color="textSubtle" fontSize="14px">
            {t('TABI locked')}
          </Text>
          <BalanceWithLoading color="text" bold fontSize="16px" value={currentLockedAmount} decimals={5} />
          {/* <BalanceWithLoading
            value={usdValueStaked}
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            prefix="~"
            unit=" USD"
          /> */}
        </Flex>
        <Flex flexDirection="column" flex="1">
          <Text color="textSubtle" fontSize="14px">
            {t('Unlocks In')}
          </Text>
          <Text color={position >= VaultPosition.LockedEnd ? 'WhiteColorLight' : 'text'} bold fontSize="16px">
            {position >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
          </Text>
          <Text color={position >= VaultPosition.LockedEnd ? 'WhiteColorLight' : 'text'} fontSize="12px">
            {t('On %date%', { date: lockEndDate })}
          </Text>
        </Flex>
      </Flex>
      <Box mb="16px">
        <LockedActions
          userShares={userData?.userShares}
          locked={userData?.locked}
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          stakingToken={stakingToken}
          stakingTokenBalance={stakingTokenBalance}
          lockedAmount={currentLockedAmountAsBigNumber}
        />
      </Box>
      <Divider />
      {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
        <Flex alignItems="center" justifyContent="space-between">
          {tooltipVisible && tooltip}
          <TooltipText>
            <Text ref={targetRef} color="textSubtle" fontSize="14px">
              {t('APY')}
            </Text>
          </TooltipText>
          <BalanceWithLoading color="text" fontSize="14px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
        </Flex>
      )}
      <LockDurationRow weekDuration={weekDuration} />
      {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
        <YieldBoostRow secondDuration={secondDuration} />
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" fontSize="14px">
          {t('Recent %symbol% profit', { symbol: tokens.cake.symbol })}
        </Text>
        <BalanceWithLoading color="text" fontSize="16px" bold value={earningTokenBalance} decimals={5} />
      </Flex>
      {position === VaultPosition.LockedEnd && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" fontSize="14px">
            {t('After Burning In')}
          </Text>
          <Text color="WhiteColorLight">
            <BurningCountDown lockEndTime={userData?.lockEndTime} />
          </Text>
        </Flex>
      )}
      {position === VaultPosition.AfterBurning && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" fontSize="14px">
            {t('After burning')}
          </Text>
          <Text color="WhiteColorLight" fontSize="14px">
            {isUndefinedOrNull(userData?.currentOverdueFee)
              ? '-'
              : t('%amount% Burned', { amount: getFullDisplayBalance(userData?.currentOverdueFee, 18, 5) })}
          </Text>
        </Flex>
      )}
    </BodyCard>
  )
}

export default memo(LockedStakingApy)

const BodyCard = styled(LightCard)`
  padding: 16px 12px;
`
