import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Flex,
  Image,
  Button,
  Slider,
  BalanceInput,
  AutoRenewIcon,
  Link,
  CalculateIcon,
  IconButton,
  Skeleton,
} from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import BigNumber from 'bignumber.js'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { DeserializedPool } from 'state/types'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import { useAppDispatch } from 'state'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import getTokenLogoURL from 'utils/getTokenLogoURL'
import { UIButton } from 'components/TabiSwap/components/ui'
import PercentageButton from './PercentageButton'
import useStakePool from '../../../hooks/useStakePool'
import useUnstakePool from '../../../hooks/useUnstakePool'

interface StakeModalProps {
  isBnbPool: boolean
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { sousId, stakingToken, earningTokenPrice, apr, userData, stakingLimit, earningToken } = pool
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useStakePool(sousId, isBnbPool)
  const { onUnstake } = useUnstakePool(sousId, pool.enableEmergencyWithdraw)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
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

  const getTokenLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit))
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

  const handleConfirmClick = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      if (isRemovingStake) {
        return onUnstake(stakeAmount, stakingToken.decimals)
      }
      return onStake(stakeAmount, stakingToken.decimals)
    })
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

  const StyledButton = styled(Button)`
    &.pancake-button--disabled {
      background: #999999;
    }
  `

  return (
    <Modal
      minWidth="346px"
      title={isRemovingStake ? t('Unstake') : t('Stake in Pool')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {stakingLimit.gt(0) && !isRemovingStake && (
        <Text color="WhiteColorLight" mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
          {t('Max stake for this pool: %amount% %token%', {
            amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text fontSize="14px" color="WhiteColorLight">
          {isRemovingStake ? t('Unstake') : t('Stake')}:
        </Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={getTokenLogoURL(stakingToken.address)} width={36} height={36} alt={stakingToken.symbol} />
          <Text fontSize="14px" color="WhiteColorLight" ml="4px">
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit || userNotEnoughToken}
        decimals={stakingToken.decimals}
      />
      {hasReachedStakeLimit && (
        <Text color="WhiteColorLight" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      {userNotEnoughToken && (
        <Text color="WhiteColorLight" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Insufficient %symbol% balance', {
            symbol: stakingToken.symbol,
          })}
        </Text>
      )}
      <Text ml="auto" color="WhiteColorLight" fontSize="12px" mb="8px">
        {t('Balance: %balance%', {
          balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
        })}
      </Text>
      {/* <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      /> */}
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
      </Flex>
      {/* {!isRemovingStake && (
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" small color="WhiteColorLight">
            {t('Annual ROI at current rates')}:
          </Text>
          {Number.isFinite(annualRoi) ? (
            <AnnualRoiContainer
              alignItems="center"
              onClick={() => {
                setShowRoiCalculator(true)
              }}
            >
              <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
              <IconButton variant="text" scale="sm">
                <CalculateIcon color="MainColor" width="18px" />
              </IconButton>
            </AnnualRoiContainer>
          ) : (
            <Skeleton width={60} />
          )}
        </Flex>
      )} */}
      {isRemovingStake && pool.enableEmergencyWithdraw && (
        <Flex maxWidth="346px" mt="24px">
          <Text textAlign="center">
            {t(
              'This pool was misconfigured. Please unstake your tokens from it, emergencyWithdraw method will be used. Your tokens will be returned to your wallet, however rewards will not be harvested.',
            )}
          </Text>
        </Flex>
      )}
      <StyledButton
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || userNotEnoughToken}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </StyledButton>
      {!isRemovingStake && (
        <StyledLink external href={getTokenLink}>
          <Button width="100%" mt="8px">
            {t('Get %symbol%', { symbol: stakingToken.symbol })}
          </Button>
        </StyledLink>
      )}
    </Modal>
  )
}

export default StakeModal
