import { useMemo } from 'react'
import { Box, Text, Flex, MessageText, Message } from 'packages/uikit'

import { LightCard } from 'components/Card'
import { addSeconds } from 'date-fns'
import { useVaultApy } from 'hooks/useVaultApy'
import { useTranslation } from 'contexts/Localization'
import _toNumber from 'lodash/toNumber'
import { convertTimeToSeconds } from 'utils/timeHelper'
import styled from 'styled-components'
import formatSecondsToWeeks from '../../../utils/formatSecondsToWeeks'
import TextRow from './TextRow'
import BalanceRow from './BalanceRow'
import DateRow from './DateRow'
import formatRoi from '../../utils/formatRoi'
import { OverviewPropsType } from '../../types'
import CalculatorButton from '../../Buttons/CalculatorButton'

const OverviewCard = styled(LightCard)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.MainColor};
`

const Overview: React.FC<OverviewPropsType> = ({
  usdValueStaked,
  lockedAmount,
  duration,
  isValidDuration,
  newDuration,
  newLockedAmount,
  lockStartTime,
  lockEndTime,
  showLockWarning,
}) => {
  const { getLockedApy, getBoostFactor } = useVaultApy()
  const { t } = useTranslation()

  const lockedApy = useMemo(() => getLockedApy(duration), [getLockedApy, duration])
  const boostFactor = useMemo(() => getBoostFactor(duration), [getBoostFactor, duration])
  const newLockedApy = useMemo(() => (newDuration && getLockedApy(newDuration)) || 0, [getLockedApy, newDuration])
  const newBoost = useMemo(() => (newDuration && getBoostFactor(newDuration)) || 0, [getBoostFactor, newDuration])

  const formattedRoi = useMemo(() => {
    return formatRoi({ usdValueStaked, lockedApy, duration })
  }, [lockedApy, usdValueStaked, duration])

  const newFormattedRoi = useMemo(() => {
    return newLockedApy && formatRoi({ usdValueStaked, lockedApy: newLockedApy, duration: newDuration })
  }, [newLockedApy, usdValueStaked, newDuration])

  const now = new Date()

  const unlockDate = newDuration
    ? addSeconds(Number(lockStartTime) ? new Date(convertTimeToSeconds(lockStartTime)) : now, newDuration)
    : Number(lockEndTime)
    ? new Date(convertTimeToSeconds(lockEndTime))
    : addSeconds(now, duration)

  return (
    <>
      <Box>
        <Flex mb="4px">
          <Text fontSize="14px" color="WhiteColorLight">
            {t('Lock')} {t('Overview')}
          </Text>
        </Flex>
        <OverviewCard>
          <BalanceRow title={t('TABI to be locked')} value={lockedAmount} newValue={newLockedAmount} decimals={2} />
          <BalanceRow
            title="apy"
            unit="%"
            value={_toNumber(lockedApy)}
            decimals={2}
            newValue={_toNumber(newLockedApy)}
            tooltipContent={t(
              'Calculated based on current rates and subject to change based on pool conditions. It is an estimate provided for your conTABIience only, and by no means represents guaranteed returns.',
            )}
          />
          <TextRow
            title={t('duration')}
            value={isValidDuration && formatSecondsToWeeks(duration)}
            newValue={isValidDuration && newDuration && formatSecondsToWeeks(newDuration)}
          />
          <BalanceRow
            title={t('Yield boost')}
            unit="x"
            value={_toNumber(boostFactor)}
            decimals={2}
            newValue={_toNumber(newBoost)}
            tooltipContent={t(
              'Your yield will be boosted based on the total lock duration of your current fixed term staking position.',
            )}
          />
          <DateRow
            color={_toNumber(newDuration) ? 'WhiteColorLight' : 'text'}
            title={t('Unlock on')}
            value={isValidDuration && unlockDate}
          />
          <BalanceRow
            title={t('Expected ROI')}
            value={formattedRoi}
            newValue={newFormattedRoi}
            prefix="$"
            decimals={2}
            suffix={<CalculatorButton />}
            tooltipContent={t(
              'Calculated based on current rates and subject to change based on pool conditions. It is an estimate provided for your conTABIience only, and by no means represents guaranteed returns.',
            )}
          />
        </OverviewCard>
      </Box>
      {showLockWarning && (
        <Box mt="16px" maxWidth="370px">
          <Message variant="warning">
            <MessageText>
              {t('You will be able to withdraw the staked TABI and profit only when the staking position is unlocked')}
            </MessageText>
          </Message>
        </Box>
      )}
    </>
  )
}

export default Overview
