import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, HelpIcon, Text, useTooltip, useMatchBreakpoints } from 'packages/uikit'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { useState } from 'react'
import Harvest from './Harvest'
import Stake from './Stake'
import AutoHarvest from './AutoHarvest'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import CakeVaultApr from './CakeVaultApr'
import PoolStatsInfo from '../../PoolStatsInfo'
import HarvestSecond from './HarvestSecond'
import TotalStakedCell from '../Cells/TotalStakedCell'
import { PanelView } from './PanelView'

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
  /* background: ${({ theme }) => theme.colors.dropdownDeep}; */
  display: flex;
  gap: 16px;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: flex-start;
  padding: 12px 0px 12px 0px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    /* padding: 24px; */
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
  display: flex;
  flex-direction: column;
  /* flex-grow: 0; */
  flex-shrink: 0;
  flex-basis: auto;
  /* padding: 5px 0 0 0; */
  width: 100%;
  height: 100%;
  max-height: 293px;
  gap: 10px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-basis: 230px;
    /* ${Text} {
      font-size: 14px;
    } */
  }
`

const FlexInfo = styled(Flex)`
  width: 100%;
  height: 100%;
  min-height: 91px;
  background: var(--color-text-third);
  border-radius: 10px;
  padding: 1rem 1.4rem;
  flex-direction: column;
  gap: 0px;
  justify-content: center;
`

const Title = styled(Text)`
  color: black;
`

const BalanceOfTitle = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-red);
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
  const { userData, vaultKey, stakingTokenPrice, totalStaked, stakingToken } = pool
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

  const totalStakedUsdValue = getBalanceNumber(totalStaked.multipliedBy(stakingTokenPrice), stakingToken.decimals)
  const [view, setView] = useState<PanelView>(PanelView.DEFAULT)

  const handleChangeView = (newView: PanelView) => {
    setView(newView)
  }

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <FlexInfo>
          <Title>TVL</Title>
          <BalanceOfTitle>${totalStakedUsdValue || 0}</BalanceOfTitle>
        </FlexInfo>

        <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />

        <FlexInfo>
          <HarvestSecond {...pool} />
        </FlexInfo>

        {isMobile && locked && (
          <Box mb="16px">
            <YieldBoostDurationRow lockEndTime={lockEndTime} lockStartTime={lockStartTime} />
          </Box>
        )}

        {pool.vaultKey && (
          <VaultPositionTagWithLabel
            userData={vaultPool.userData}
            width={['auto', , '100%']}
            ml={['0px', , , , , '0px']}
            mr={['0', , , , , '0']}
          />
        )}
      </InfoSection>

      <ActionContainer
        style={{ minHeight: '293px', background: 'var(--color-text-third)', borderRadius: '10px', width: '100%' }}
      >
        {isMobile && vaultKey && vaultPosition === VaultPosition.None && (
          <CakeVaultApr pool={pool} userData={vaultPool.userData} vaultPosition={vaultPosition} />
        )}
        {view === PanelView.DEFAULT && (
          <ActionContainer
            style={{ maxHeight: '100%', flexDirection: 'column', padding: '1.2rem 1.4rem', gap: '0px' }}
            isAutoVault={!!pool.vaultKey}
            hasBalance={poolStakingTokenBalance.gt(0)}
          >
            <TotalStakedCell pool={pool} />
            <Stake pool={pool} onChangeView={handleChangeView} view={view} />
            {pool.vaultKey ? <AutoHarvest {...pool} /> : <Harvest {...pool} />}
          </ActionContainer>
        )}

        {view === PanelView.DEPOSIT && (
          <ActionContainer
            style={{ maxHeight: '100%', flexDirection: 'column', padding: '0.7rem 1.4rem', gap: '0px' }}
            isAutoVault={!!pool.vaultKey}
            hasBalance={poolStakingTokenBalance.gt(0)}
          >
            {/* <TotalStakedCell pool={pool} /> */}
            <Text fontSize={['18px']} bold color="black">
              Deposit More
            </Text>
            <Stake pool={pool} onChangeView={handleChangeView} view={view} />
            {/* {pool.vaultKey ? <AutoHarvest {...pool} /> : <Harvest {...pool} />} */}
          </ActionContainer>
        )}

        {view === PanelView.WITHDRAW && (
          <ActionContainer
            style={{ maxHeight: '100%', flexDirection: 'column', padding: '1.4rem 1.4rem', gap: '0px' }}
            isAutoVault={!!pool.vaultKey}
            hasBalance={poolStakingTokenBalance.gt(0)}
          >
            {/* <TotalStakedCell pool={pool} /> */}
            <Text fontSize={['18px']} bold color="black">
              Withdraw
            </Text>
            <Stake pool={pool} onChangeView={handleChangeView} view={view} />
            {/* {pool.vaultKey ? <AutoHarvest {...pool} /> : <Harvest {...pool} />} */}
          </ActionContainer>
        )}
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
