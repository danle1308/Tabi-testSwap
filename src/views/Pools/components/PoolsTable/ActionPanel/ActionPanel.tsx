import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, HelpIcon, Text, useTooltip, useMatchBreakpoints } from 'packages/uikit'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { BIG_ZERO } from 'utils/bigNumber'
import Harvest from './Harvest'
import Stake from './Stake'
import AutoHarvest from './AutoHarvest'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import CakeVaultApr from './CakeVaultApr'
import PoolStatsInfo from '../../PoolStatsInfo'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdownDeep};
  display: flex;
  gap: 16px;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: flex-start;
  padding: 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 24px;
  }
`

const ActionContainer = styled.div<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: ${({ isAutoVault }) => (isAutoVault ? 'row' : null)};
    align-items: ${({ isAutoVault, hasBalance }) =>
      isAutoVault ? (hasBalance ? 'flex-start' : 'stretch') : 'stretch'};
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  pool: DeserializedPool
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 5px 0 0 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-basis: 230px;
    ${Text} {
      font-size: 14px;
    }
  }
`

const RoundedBox = styled.div`
  border-radius: 25px;
  overflow: hidden;
  width: fit-content;
`

const YieldBoostDurationRow = ({ lockEndTime, lockStartTime }) => {
  const { weekDuration, secondDuration } = useUserDataInVaultPresenter({
    lockEndTime,
    lockStartTime,
  })

  return (
    <>
      <YieldBoostRow secondDuration={secondDuration} />
      <LockDurationRow weekDuration={weekDuration} />
    </>
  )
}

const ActionPanel: React.FC<ActionPanelProps> = ({ account, pool, expanded }) => {
  const { userData, vaultKey } = pool
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const vaultPool = useVaultPoolByKey(vaultKey)
  const {
    userData: {
      lockEndTime,
      lockStartTime,
      balance: { cakeAsBigNumber },
      locked,
    },
  } = vaultPool

  const vaultPosition = getVaultPosition(vaultPool.userData)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = vaultKey
    ? cakeAsBigNumber.plus(stakingTokenBalance)
    : stakedBalance.plus(stakingTokenBalance)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Rewards are distributed and included into your staking balance automatically. There’s no need to manually compound your rewards.',
  )

  const {
    targetRef: tagTargetRef,
    tooltip: tagTooltip,
    tooltipVisible: tagTooltipVisible,
  } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom-start',
  })

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {isMobile && locked && (
          <Box mb="16px">
            <YieldBoostDurationRow lockEndTime={lockEndTime} lockStartTime={lockStartTime} />
          </Box>
        )}
        <Flex flexDirection="column" mb="8px">
          <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />
        </Flex>
        {pool.vaultKey && (
          <VaultPositionTagWithLabel
            userData={vaultPool.userData}
            width={['auto', , '100%']}
            ml={['0px', , , , , '0px']}
            mr={['0', , , , , '0']}
          />
        )}
        <Flex alignItems="center">
          {vaultKey ? (
            <RoundedBox>
              <CompoundingPoolTag />
            </RoundedBox>
          ) : (
            <RoundedBox>
              <ManualPoolTag />
            </RoundedBox>
          )}
          {tagTooltipVisible && tagTooltip}
          <span ref={tagTargetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </span>
        </Flex>
      </InfoSection>
      <ActionContainer>
        {isMobile && vaultKey && vaultPosition === VaultPosition.None && (
          <CakeVaultApr pool={pool} userData={vaultPool.userData} vaultPosition={vaultPosition} />
        )}
        <Box width="100%">
          <ActionContainer isAutoVault={!!pool.vaultKey} hasBalance={poolStakingTokenBalance.gt(0)}>
            {pool.vaultKey ? <AutoHarvest {...pool} /> : <Harvest {...pool} />}
            <Stake pool={pool} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
