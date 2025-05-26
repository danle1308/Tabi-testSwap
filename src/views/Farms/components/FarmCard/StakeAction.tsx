import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, Flex, IconButton, AddIcon, MinusIcon, useModal } from 'packages/uikit'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useRouter } from 'next/router'
import { useLpTokenPrice, useFarmUser, usePriceCakeBusd } from 'state/farms/hooks'
import { UIButton } from 'components/TabiSwap/components/ui'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import useUnstakeFarms from '../../hooks/useUnstakeFarms'
import useStakeFarms from '../../hooks/useStakeFarms'
import { FarmWithStakedValue } from '../types'
import StakedLP from '../StakedLP'

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
  displayApr?: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`
const StyledIcon = styled(IconButton)`
  background-color: transparent;
  border: none;
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  quoteToken,
  token,
  lpSymbol,
  pid,
  multiplier,
  apr,
  displayApr,
  addLiquidityUrl,
  lpLabel,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const { t } = useTranslation()
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const { tokenBalance, stakedBalance } = useFarmUser(pid)
  const cakePrice = usePriceCakeBusd()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )

  const renderStakingButtons = () => {
    return (
      <>
        <StakedLP
          stakedBalance={stakedBalance}
          lpSymbol={lpSymbol}
          quoteTokenSymbol={quoteToken.symbol}
          tokenSymbol={token.symbol}
          lpTotalSupply={lpTotalSupply}
          tokenAmountTotal={tokenAmountTotal}
          quoteTokenAmountTotal={quoteTokenAmountTotal}
        />
        <IconButtonWrapper>
          <StyledIcon variant="tertiary" onClick={onPresentWithdraw} mr="6px">
            <MinusIcon color="MainColor" style={{ border: `2px solid #fff`, borderRadius: '50px' }} width="26px" />
          </StyledIcon>
          <StyledIcon
            variant="tertiary"
            onClick={onPresentDeposit}
            disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
          >
            <AddIcon color="MainColor" style={{ border: `2px solid #fff`, borderRadius: '50px' }} width="26px" />
          </StyledIcon>
        </IconButtonWrapper>
      </>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      {stakedBalance.eq(0) ? (
        <UIButton.UIStyledButton
          width="100%"
          onClick={onPresentDeposit}
          disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
        >
          {t('Stake LP')}
        </UIButton.UIStyledButton>
      ) : (
        <>{renderStakingButtons()}</>
      )}
    </Flex>
  )
}

export default StakeAction
