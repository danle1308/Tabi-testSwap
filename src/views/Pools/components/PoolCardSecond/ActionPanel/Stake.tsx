import { useEffect, useState } from 'react'
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
  SecondWalletIcon,
  SecondBalanceInput,
  AutoRenewIcon,
} from 'packages/uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import useToast from 'hooks/useToast'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'

import { UIButton } from 'components/TabiSwap/components/ui'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { RowBetween } from 'components/Layout/Row'
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
import { PanelView } from './PanelView'
import StakeInput from './StakeInput'
import useStakePool from '../../../hooks/useStakePool'
import useUnstakePool from '../../../hooks/useUnstakePool'
import PercentageButton from '../../PoolCard/Modals/PercentageButton'

const IconButtonWrapper = styled.div`
  display: flex;
  border: 0;
`

const StyledConnectWalletButton = styled(ConnectWalletButton)`
  margin-top: 5px;
  height: 39px;
  font-size: 14px;
  font-weight: 700;
`

const StyledButtonEnable = styled(Button)`
  height: 39px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 10px;
`

const Title = styled(Text)`
  color: var(--color-grey-border-input);
`

const NumberBalance = styled(Text)``

const RestyledActionContainer = styled(ActionContainer)`
  gap: 0px;
  /* justify-content: space-between; */
  max-height: fit-content;
  /* margin-top: 1rem; */
`

interface StackedActionProps {
  pool: DeserializedPool
  onChangeView: (view: PanelView) => void
  view: PanelView
  onDismiss?: () => void
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool, onChangeView, view, onDismiss }) => {
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
    apr,
    earningTokenPrice,
    enableEmergencyWithdraw,
  } = pool
  const [showStatus, setShowStatus] = useState(false)
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

  // console.log('isBnbPool', isBnbPool)
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

  const dispatch = useAppDispatch()
  const { onStake } = useStakePool(sousId, isBnbPool)
  const { onUnstake } = useUnstakePool(sousId, pool.enableEmergencyWithdraw)
  // console.log('enableEmergencyWithdraw', pool.enableEmergencyWithdraw)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: loadingProcess } = useCatchTxError()
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)

  const [isRemovingStake, setRemovingStake] = useState(false)

  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? stakingLimit : stakingTokenBalance
  }
  const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)

  const userNotEnoughToken = isRemovingStake
    ? userData.stakedBalance.lt(fullDecimalStakeAmount)
    : userData.stakingTokenBalance.lt(fullDecimalStakeAmount)

  const usdValueStaked = new BigNumber(stakeAmount).times(stakingTokenPrice)
  const formattedUsdValueStaked = !usdValueStaked.isNaN() && formatNumber(usdValueStaked.toNumber())

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !usdValueStaked.isNaN() ? usdValueStaked.toNumber() : 0,
    apr,
    earningTokenPrice,
  })

  const annualRoi = interestBreakdown[3] * pool.earningTokenPrice
  const formattedAnnualRoi = formatNumber(annualRoi, annualRoi > 10000 ? 0 : 2, annualRoi > 10000 ? 0 : 2)
  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit))
      // console.log('hasReachedStakeLimit', hasReachedStakeLimit)
    }
  }, [
    stakeAmount,
    stakingLimit,
    userData,
    stakingToken,
    isRemovingStake,
    setHasReachedStakedLimit,
    fullDecimalStakeAmount,
  ])

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), stakingToken.decimals)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handle = async () => {
    setShowStatus(true)
    // onStake(stakeAmount, stakingToken.decimals)
  }

  const handleWithdraw = async () => {
    setRemovingStake(true)
    const receipt = await fetchWithCatchTxError(() => {
      if (isRemovingStake) {
        console.log('chạy unStake')
        return onUnstake(stakeAmount, stakingToken.decimals)
      }
      console.log('chạy Stake')
      return onStake(stakeAmount, stakingToken.decimals)
    })

    console.log('receipt', receipt)
    if (receipt?.status) {
      if (isRemovingStake) {
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have also been harvested to your wallet!', {
              symbol: earningToken.symbol,
            })}
          </ToastDescriptionWithTx>,
        )
      } else {
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% funds have been staked in the pool!', {
              symbol: stakingToken.symbol,
            })}
          </ToastDescriptionWithTx>,
        )
      }
      dispatch(updateUserStakedBalance({ sousId, account }))
      dispatch(updateUserPendingReward({ sousId, account }))
      dispatch(updateUserBalance({ sousId, account }))
      onDismiss?.()
    }
  }

  const handleConfirmClick = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      if (isRemovingStake) {
        console.log('chạy unStake')
        return onUnstake(stakeAmount, stakingToken.decimals)
      }
      console.log('chạy Stake')
      return onStake(stakeAmount, stakingToken.decimals)
    })

    console.log('receipt', receipt)
    if (receipt?.status) {
      if (isRemovingStake) {
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have also been harvested to your wallet!', {
              symbol: earningToken.symbol,
            })}
          </ToastDescriptionWithTx>,
        )
      } else {
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% funds have been staked in the pool!', {
              symbol: stakingToken.symbol,
            })}
          </ToastDescriptionWithTx>,
        )
      }
      dispatch(updateUserStakedBalance({ sousId, account }))
      dispatch(updateUserPendingReward({ sousId, account }))
      dispatch(updateUserBalance({ sousId, account }))
      onDismiss?.()
    }
  }

  const getTokenLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        earningTokenPrice={earningTokenPrice}
        stakingTokenPrice={stakingTokenPrice}
        apr={apr}
        linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
        linkHref={getTokenLink}
        stakingTokenBalance={userData.stakedBalance.plus(stakingTokenBalance)}
        stakingTokenSymbol={stakingToken.symbol}
        earningTokenSymbol={earningToken.symbol}
        onBack={() => setShowRoiCalculator(false)}
        initialValue={stakeAmount}
      />
    )
  }

  const onDeposit = () => {
    if (vaultKey) {
      onPresentVaultStake()
    } else {
      // onPresentStake()
      console.log('thực hiện deposite không vaultkey')
    }
  }

  const onWithdraw = () => {
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const handleBack = () => {
    onChangeView(PanelView.DEFAULT)
  }

  const handleChangeViewDeposit = () => {
    onChangeView(PanelView.DEPOSIT)
  }

  if (!account) {
    return (
      <RestyledActionContainer
        marginTop={view === PanelView.DEPOSIT || view === PanelView.WITHDRAW ? '0.3rem' : '1rem'}
      >
        <ActionTitles>
          <Title fontSize="14px" as="span">
            {t('Start staking')}
          </Title>
        </ActionTitles>
        <ActionContent style={{ marginTop: '0px' }}>
          <StyledConnectWalletButton width="100%" />
        </ActionContent>
      </RestyledActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <RestyledActionContainer
        marginTop={view === PanelView.DEPOSIT || view === PanelView.WITHDRAW ? '0.3rem' : '1rem'}
      >
        <ActionTitles>
          <Title fontSize="14px" as="span">
            {t('Start staking')}
          </Title>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </RestyledActionContainer>
    )
  }

  if (notMeetRequired || notMeetThreshold) {
    return (
      <RestyledActionContainer
        marginTop={view === PanelView.DEPOSIT || view === PanelView.WITHDRAW ? '0.3rem' : '1rem'}
      >
        <ActionTitles>
          <Title fontSize="14px" color="WhiteColorLight" as="span">
            {t('Enable pool')}
          </Title>
        </ActionTitles>
        <ActionContent>
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        </ActionContent>
      </RestyledActionContainer>
    )
  }

  if (needsApproval) {
    return (
      <RestyledActionContainer
        marginTop={view === PanelView.DEPOSIT || view === PanelView.WITHDRAW ? '0.3rem' : '1rem'}
      >
        <ActionTitles>
          <Title fontSize="14px" color="WhiteColorLight" as="span">
            {t('Enable pool')}
          </Title>
        </ActionTitles>
        <ActionContent>
          <StyledButtonEnable width="100%" disabled={pendingTx} onClick={handleApprove}>
            {t('Enable')}
          </StyledButtonEnable>
        </ActionContent>
      </RestyledActionContainer>
    )
  }

  // console.log('stakeAmount', stakeAmount)
  // console.log('stakingToken.decimals', stakingToken.decimals)
  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    return (
      <>
        <RestyledActionContainer
          flex={vaultPosition > 1 ? 1.5 : 1}
          marginTop={view === PanelView.DEPOSIT || view === PanelView.WITHDRAW ? '0.3rem' : '1rem'}
        >
          <ActionContent mt={0}>
            <Flex flex="1" flexDirection="column" height="100%">
              {view === PanelView.DEFAULT ? (
                <>
                  <Flex flexDirection="column" style={{ gap: '0px' }}>
                    <Title fontSize="14px" as="span">
                      Balance
                    </Title>
                    <ActionContent mt={0}>
                      <Flex position="relative" style={{ gap: '5px' }}>
                        <SecondWalletIcon width={10} height={9} />
                        <Text bold color="black">
                          {t('%balance% %symbol%', {
                            balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
                            symbol: stakingToken.symbol,
                          })}
                        </Text>
                      </Flex>
                    </ActionContent>
                  </Flex>
                </>
              ) : null}

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

              {view === PanelView.DEPOSIT ? (
                <>
                  <Flex flexDirection="column" style={{ gap: '0px' }}>
                    {/* <StakeInput
                      isBnbPool={isBnbPool}
                      pool={pool}
                      stakingTokenBalance={stakingTokenBalance}
                      stakingTokenPrice={stakingTokenPrice}
                    /> */}
                    <Flex
                      flexDirection="column"
                      style={{
                        border: '1px solid black',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem',
                        gap: '0',
                        marginTop: '5px',
                      }}
                    >
                      <SecondBalanceInput
                        value={stakeAmount}
                        onUserInput={handleStakeInputChange}
                        currencyValue={stakingTokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
                        isWarning={hasReachedStakeLimit || userNotEnoughToken}
                        decimals={stakingToken.decimals}
                        stakingToken={stakingToken}
                      />
                      <hr style={{ width: '100%', height: '0.5px', borderTop: '1px solid #adadad' }} />
                      <RowBetween style={{ alignItems: 'center' }}>
                        <Flex height="100%" alignItems="center">
                          <SecondWalletIcon width={10} height={9} />
                          <Text color="black" fontSize="12px" bold>
                            {t('%balance% %symbol%', {
                              balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
                              symbol: stakingToken.symbol,
                            })}
                          </Text>
                        </Flex>
                        <Flex alignItems="center" justifyContent="space-between">
                          <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
                          <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
                          <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
                        </Flex>
                      </RowBetween>
                      {isRemovingStake && pool.enableEmergencyWithdraw && (
                        <Flex maxWidth="346px" mt="24px">
                          <Text textAlign="center" color="var(--color-red)">
                            {t(
                              'This pool was misconfigured. Please unstake your tokens from it, emergencyWithdraw method will be used. Your tokens will be returned to your wallet, however rewards will not be harvested.',
                            )}
                          </Text>
                        </Flex>
                      )}
                      <Flex>
                        {stakingLimit.gt(0) && !isRemovingStake && (
                          <Text color="var(--color-red)" mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
                            {t('Max stake for this pool: %amount% %token%', {
                              amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
                              token: stakingToken.symbol,
                            })}
                          </Text>
                        )}
                        {hasReachedStakeLimit && (
                          <Text color="var(--color-red)" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
                            {t('Maximum total stake: %amount% %token%', {
                              amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
                              token: stakingToken.symbol,
                            })}
                          </Text>
                        )}
                        {userNotEnoughToken && (
                          <Text color="var(--color-red)" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
                            {t('Insufficient %symbol% balance', {
                              symbol: stakingToken.symbol,
                            })}
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                </>
              ) : null}

              {view === PanelView.WITHDRAW ? (
                <>
                  <Flex flexDirection="column" style={{ gap: '0px' }}>
                    {/* <StakeInput
                      isBnbPool={isBnbPool}
                      pool={pool}
                      stakingTokenBalance={stakingTokenBalance}
                      stakingTokenPrice={stakingTokenPrice}
                    /> */}
                    <Flex
                      flexDirection="column"
                      style={{
                        border: '1px solid black',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem',
                        gap: '0',
                        marginTop: '5px',
                      }}
                    >
                      <SecondBalanceInput
                        value={stakeAmount}
                        onUserInput={handleStakeInputChange}
                        currencyValue={stakingTokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
                        isWarning={hasReachedStakeLimit || userNotEnoughToken}
                        decimals={stakingToken.decimals}
                        stakingToken={stakingToken}
                      />
                      <hr style={{ width: '100%', height: '0.5px', borderTop: '1px solid #adadad' }} />
                      <RowBetween style={{ alignItems: 'center' }}>
                        <Flex height="100%" alignItems="center">
                          <SecondWalletIcon width={10} height={9} />
                          <Text color="black" fontSize="12px" bold>
                            {t('%balance% %symbol%', {
                              balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
                              symbol: stakingToken.symbol,
                            })}
                          </Text>
                        </Flex>
                        <Flex alignItems="center" justifyContent="space-between">
                          <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
                          <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
                          <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
                        </Flex>
                      </RowBetween>
                      {isRemovingStake && pool.enableEmergencyWithdraw && (
                        <Flex maxWidth="346px" mt="24px">
                          <Text textAlign="center" color="var(--color-red)">
                            {t(
                              'This pool was misconfigured. Please unstake your tokens from it, emergencyWithdraw method will be used. Your tokens will be returned to your wallet, however rewards will not be harvested.',
                            )}
                          </Text>
                        </Flex>
                      )}
                      <Flex>
                        {stakingLimit.gt(0) && !isRemovingStake && (
                          <Text color="var(--color-red)" mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
                            {t('Max stake for this pool: %amount% %token%', {
                              amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
                              token: stakingToken.symbol,
                            })}
                          </Text>
                        )}
                        {hasReachedStakeLimit && (
                          <Text color="var(--color-red)" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
                            {t('Maximum total stake: %amount% %token%', {
                              amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
                              token: stakingToken.symbol,
                            })}
                          </Text>
                        )}
                        {userNotEnoughToken && (
                          <Text color="var(--color-red)" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
                            {t('Insufficient %symbol% balance', {
                              symbol: stakingToken.symbol,
                            })}
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                </>
              ) : null}

              {(vaultPosition === VaultPosition.Flexible || !vaultKey) && (
                <Flex width="100%" mt="10px">
                  {reachStakingLimit ? (
                    <span ref={targetRef} style={{ width: '50%' }}>
                      <StyledButtonEnable disabled style={{ width: '100%' }}>
                        {t(`Deposit More`)}
                      </StyledButtonEnable>
                    </span>
                  ) : view === PanelView.DEFAULT || view === PanelView.DEPOSIT ? (
                    <>
                      <StyledButtonEnable
                        onClick={() => {
                          if (view === PanelView.DEFAULT) {
                            handleChangeViewDeposit()
                          } else if (view === PanelView.DEPOSIT) {
                            handleConfirmClick()
                            // handle()
                            // onStake(stakeAmount, stakingToken.decimals)
                          }
                        }}
                        disabled={isFinished}
                        isLoading={loadingProcess}
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                        style={{ width: '50%' }}
                      >
                        {t(`Deposit More`)}
                      </StyledButtonEnable>
                    </>
                  ) : (
                    <>
                      <StyledButtonEnable
                        onClick={() => handleWithdraw()}
                        // onClick={() => handleConfirmClick()}
                        disabled={isFinished}
                        style={{ width: '50%' }}
                      >
                        {t(`Withdraw`)}
                      </StyledButtonEnable>
                    </>
                  )}

                  {view === PanelView.DEFAULT ? (
                    <>
                      <StyledButtonEnable
                        // onClick={onWithdraw}
                        onClick={() => onChangeView(PanelView.WITHDRAW)}
                        style={{
                          background: 'var(--color-grey-border-input)',
                          width: '50%',
                        }}
                      >
                        {t(`Withdraw`)}
                      </StyledButtonEnable>
                    </>
                  ) : (
                    <>
                      <StyledButtonEnable
                        // onClick={onWithdraw}
                        onClick={handleBack}
                        style={{
                          background: 'var(--color-grey-border-input)',
                          width: '50%',
                        }}
                      >
                        {t(`Cancel`)}
                      </StyledButtonEnable>
                    </>
                  )}
                </Flex>
              )}

              {showStatus ? (
                <Flex width="100%" mt="1.5rem">
                  <Text fontSize={['12px']} color="black">
                    You are depositing additional{' '}
                    <strong>
                      {stakeAmount || 0} {stakingToken.symbol}
                    </strong>{' '}
                    to the pool.
                  </Text>
                </Flex>
              ) : null}
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

            {/* {(vaultPosition === VaultPosition.Flexible || !vaultKey) && (
              <IconButtonWrapper>
                <IconButton style={{ border: '0' }} variant="secondary" onClick={onWithdraw} mr="6px">
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
            )} */}
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
        </RestyledActionContainer>
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
    <RestyledActionContainer marginTop={view === PanelView.DEPOSIT || view === PanelView.WITHDRAW ? '0.3rem' : '1rem'}>
      <ActionTitles>
        <Text fontSize="14px" as="span" color="var(--color-grey-border-input)">
          {t('Stake')} {stakingToken.symbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        {vaultKey ? (
          <VaultStakeButtonGroup
            onFlexibleClick={stakingTokenBalance.gt(0) ? onDeposit : onPresentTokenRequired}
            onLockedClick={openPresentLockedStakeModal}
          />
        ) : (
          <Button
            width="100%"
            onClick={stakingTokenBalance.gt(0) ? onDeposit : onPresentTokenRequired}
            disabled={isFinished}
            height="35px"
            fontWeight="700"
            fontSize={['14px']}
            style={{
              borderRadius: '10px',
            }}
          >
            {t('Stake')}
          </Button>
        )}
      </ActionContent>
    </RestyledActionContainer>
  )
}

export default Staked
