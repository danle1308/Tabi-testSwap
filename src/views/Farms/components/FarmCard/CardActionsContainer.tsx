import { Button, Flex, Text } from 'packages/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { UIButton } from 'components/TabiSwap/components/ui'
import { FarmWithStakedValue } from '../types'
import useApproveFarm from '../../hooks/useApproveFarm'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const Action = styled.div``

const EnableButton = styled(UIButton.UIStyledButton)``

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, lpLabel, displayApr }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { pid, lpAddresses } = farm
  const { allowance, earnings } = farm.userData || {}
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()

  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(2, BigNumber.ROUND_DOWN)

  const lpContract = useERC20(lpAddress)

  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }, [onApprove, dispatch, account, pid, t, toastSuccess, fetchWithCatchTxError])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr} />
    ) : (
      <EnableButton mt="8px" width="100%" disabled={pendingTx} onClick={handleApprove}>
        {t('Enable Contract')}
      </EnableButton>
    )
  }

  return (
    <Action>
      <HarvestAction earnings={earnings} pid={pid} isCard />
      <Flex mb="12px" justifyContent="space-between">
        <Text bold color="WhiteColor" pr="4px">
          {farm.lpSymbol} {t('Staked')}
        </Text>
        <Text>{displayBalance}</Text>
      </Flex>
      {!account ? <ConnectWalletButton width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
