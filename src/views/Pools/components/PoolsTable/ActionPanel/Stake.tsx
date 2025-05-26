import {
  AddIcon,
  Button,
  Flex,
  IconButton,
  MinusIcon,
  Skeleton,
  Text,
  useModal,
  useTooltip,
  Box,
  useMatchBreakpoints,
  SkeletonV2,
} from 'packages/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'

import { UIButton } from 'components/TabiSwap/components/ui'
import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from '../../PoolCard/Modals/StakeModal'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { VaultStakeButtonGroup } from '../../Vault/VaultStakeButtonGroup'
import AddCakeButton from '../../LockedPool/Buttons/AddCakeButton'
import ExtendButton from '../../LockedPool/Buttons/ExtendDurationButton'
import AfterLockedActions from '../../LockedPool/Common/AfterLockedActions'
import ConvertToLock from '../../LockedPool/Common/ConvertToLock'
import BurningCountDown from '../../LockedPool/Common/BurningCountDown'
import LockedStakedModal from '../../LockedPool/Modals/LockedStakeModal'

const IconButtonWrapper = styled.div`
  display: flex;
  border: 0;
`

const StyledConnectWalletButton = styled(ConnectWalletButton)``

const StyledButtonEnable = styled(Button)`
  height: 35px;
  font-weight: 500;
  font-size: 0.875rem;
`

interface StackedActionProps {
  pool: DeserializedPool
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    vaultKey,
    profileRequirement,
    userDataLoaded,
  } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()
  const { handleApprove: handleVaultApprove, pendingTx: pendingVaultTx } = useVaultApprove(setLastUpdated)

  const handleApprove = vaultKey ? handleVaultApprove : handlePoolApprove
  const pendingTx = vaultKey ? pendingVaultTx : pendingPoolTx

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const {
    userData: {
      userShares,
      lockEndTime,
      locked,
      lockStartTime,
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
      currentOverdueFee,
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const { lockEndDate, remainingTime } = useUserDataInVaultPresenter({
    lockStartTime: lockStartTime ?? '0',
    lockEndTime: lockEndTime ?? '0',
  })

  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = vaultKey && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const needsApproval = vaultKey ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakedModal
      currentBalance={stakingTokenBalance}
      stakingToken={stakingToken}
      stakingTokenBalance={stakingTokenBalance}
    />,
  )

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const onStake = () => {
    if (vaultKey) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const onUnstake = () => {
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="14px" color="WhiteColorLight" as="span">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <StyledConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="14px" color="WhiteColorLight" as="span">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (notMeetRequired || notMeetThreshold) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="14px" color="WhiteColorLight" as="span">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="14px" color="WhiteColorLight" as="span">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <StyledButtonEnable width="100%" disabled={pendingTx} onClick={handleApprove}>
            {t('Enable')}
          </StyledButtonEnable>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    return (
      <>
        <ActionContainer flex={vaultPosition > 1 ? 1.5 : 1}>
          <ActionContent mt={0}>
            <Flex flex="1" flexDirection="column" height="100%">
              <ActionTitles>
                <Text fontSize="14px" color="WhiteColorLight" as="span">
                  {stakingToken.symbol} {locked ? t('Locked') : t('Staked')}
                </Text>
              </ActionTitles>
              <ActionContent mt={0}>
                <Flex flexDirection="column" position="relative" style={{ gap: '5px' }}>
                  <Balance
                    lineHeight="1"
                    bold
                    fontSize="16px"
                    decimals={5}
                    value={vaultKey ? cakeAsNumberBalance : stakedTokenBalance}
                  />
                  <SkeletonV2
                    isDataReady={Number.isFinite(vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance)}
                    width={120}
                    wrapperProps={{ height: '20px' }}
                    skeletonTop="2px"
                  >
                    <Balance
                      fontSize="12px"
                      display="inline"
                      color="textSubtle"
                      decimals={2}
                      value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                      unit=" USD"
                      prefix="~"
                    />
                  </SkeletonV2>
                </Flex>
              </ActionContent>
              {vaultPosition === VaultPosition.Locked && (
                <Flex mt="auto">
                  <AddCakeButton
                    lockEndTime={lockEndTime}
                    lockStartTime={lockStartTime}
                    currentLockedAmount={cakeAsBigNumber}
                    stakingToken={stakingToken}
                    currentBalance={stakingTokenBalance}
                    stakingTokenBalance={stakingTokenBalance}
                  />
                </Flex>
              )}
            </Flex>
            {vaultPosition >= VaultPosition.Locked && (
              <Flex flex="1" flexDirection="column" height="100%">
                <Text fontSize="14px" color="WhiteColorLight" as="span">
                  {t('Unlocks In')}
                </Text>
                <Flex flexDirection="column" style={{ gap: '5px' }}>
                  <Text
                    lineHeight="1"
                    bold
                    fontSize="16px"
                    color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
                  >
                    {vaultPosition >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
                  </Text>
                  <Text
                    height="20px"
                    fontSize="12px"
                    display="inline"
                    color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
                  >
                    {t('On %date%', { date: lockEndDate })}
                  </Text>
                </Flex>
                {vaultPosition === VaultPosition.Locked && (
                  <Box mt="auto">
                    <ExtendButton
                      lockEndTime={lockEndTime}
                      lockStartTime={lockStartTime}
                      stakingToken={stakingToken}
                      currentLockedAmount={cakeAsNumberBalance}
                    >
                      {t('Extend')}
                    </ExtendButton>
                  </Box>
                )}
              </Flex>
            )}
            {(vaultPosition === VaultPosition.Flexible || !vaultKey) && (
              <IconButtonWrapper>
                <IconButton style={{ border: '0' }} variant="secondary" onClick={onUnstake} mr="6px">
                  <MinusIcon
                    style={{ border: '2px solid #fff', borderRadius: '50px' }}
                    color="MainColor"
                    width="20px"
                  />
                </IconButton>
                {reachStakingLimit ? (
                  <span ref={targetRef}>
                    <IconButton variant="secondary" disabled>
                      <AddIcon color="MainColor" width="24px" height="24px" />
                    </IconButton>
                  </span>
                ) : (
                  <IconButton
                    style={{ border: '0' }}
                    variant="secondary"
                    onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                    disabled={isFinished}
                  >
                    <AddIcon style={{ border: '2px solid #fff', borderRadius: '50px' }} color="#fff" width="20px" />
                  </IconButton>
                )}
              </IconButtonWrapper>
            )}
            {!isMobile && vaultPosition >= VaultPosition.LockedEnd && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
                </Text>
                <Text lineHeight="1" mt="8px" bold fontSize="20px" color="WhiteColorLight">
                  {vaultPosition === VaultPosition.AfterBurning ? (
                    isUndefinedOrNull(currentOverdueFee) ? (
                      '-'
                    ) : (
                      t('%amount% Burned', { amount: getFullDisplayBalance(currentOverdueFee, 18, 5) })
                    )
                  ) : (
                    <BurningCountDown lockEndTime={lockEndTime} />
                  )}
                </Text>
              </Flex>
            )}
            {tooltipVisible && tooltip}
          </ActionContent>
        </ActionContainer>
        {isMobile && vaultPosition >= VaultPosition.LockedEnd && (
          <Flex mb="24px" justifyContent="space-between">
            <Text fontSize="14px" color="WhiteColorLight" as="span">
              {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
            </Text>
            <Text fontSize="14px" bold color="WhiteColorLight">
              {vaultPosition === VaultPosition.AfterBurning ? (
                isUndefinedOrNull(currentOverdueFee) ? (
                  '-'
                ) : (
                  t('%amount% Burned', { amount: getFullDisplayBalance(currentOverdueFee, 18, 5) })
                )
              ) : (
                <BurningCountDown lockEndTime={lockEndTime} />
              )}
            </Text>
          </Flex>
        )}
        {[VaultPosition.AfterBurning, VaultPosition.LockedEnd].includes(vaultPosition) && (
          <Box
            width="100%"
            mt={['0', '0', '0', '0', '0']}
            ml={['0', '0', '0', '0', '0', '0']}
            mr={['0', '0', '0', '0', '0', '0px']}
          >
            <AfterLockedActions
              isInline
              position={vaultPosition}
              currentLockedAmount={cakeAsNumberBalance}
              stakingToken={stakingToken}
              lockEndTime="0"
              lockStartTime="0"
            />
          </Box>
        )}
        {vaultPosition === VaultPosition.Flexible && (
          <Box
            width="100%"
            mt={['0', '0', '0', '0', '0']}
            ml={['0', '0', '0', '0', '0']}
            mr={['0', '0', '0', '0', '0']}
          >
            <ConvertToLock stakingToken={stakingToken} currentStakedAmount={cakeAsNumberBalance} isInline />
          </Box>
        )}
      </>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="14px" color="WhiteColorLight" as="span">
          {t('Stake')} {stakingToken.symbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        {vaultKey ? (
          <VaultStakeButtonGroup
            onFlexibleClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            onLockedClick={openPresentLockedStakeModal}
          />
        ) : (
          <Button
            width="100%"
            onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            disabled={isFinished}
            height="35px"
            fontWeight="500"
            fontSize={['0.875rem']}
          >
            {t('Stake')}
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
