import { Flex, Heading, Text } from 'packages/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'

import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { UIButton } from 'components/TabiSwap/components/ui'
import useHarvestFarm from '../../hooks/useHarvestFarm'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  isCard?: boolean
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid, isCard }) => {
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { t } = useTranslation()
  const { onReward } = useHarvestFarm(pid)
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(2, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0

  if (isCard) {
    return (
      <Flex flexDirection="column" mb="12px">
        <Flex justifyContent="space-between">
          <Text color="WhiteColor" pr="4px">
            {t('Earned')}:
          </Text>

          <Flex flexDirection="column">
            <Text color={rawEarningsBalance.eq(0) ? 'WhiteColor' : 'WhiteColor'}>{displayBalance}</Text>
            {/* {earningsBusd > 0 && (
              <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
            )} */}
          </Flex>
        </Flex>

        <UIButton.UIStyledButton
          disabled={rawEarningsBalance.eq(0) || pendingTx}
          onClick={async () => {
            const receipt = await fetchWithCatchTxError(() => {
              return onReward()
            })
            if (receipt?.status) {
              toastSuccess(
                `${t('Harvested')}!`,
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                  {t('Your %symbol% earnings have been sent to your wallet!', { symbol: '' })}
                </ToastDescriptionWithTx>,
              )
              dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
            }
          }}
        >
          {pendingTx ? t('Harvesting') : t('Harvest')}
        </UIButton.UIStyledButton>
      </Flex>
    )
  }

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={rawEarningsBalance.eq(0) ? 'WhiteColorLight' : 'WhiteColor'}>{displayBalance}</Heading>
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      <UIButton.UIStyledButton
        disabled={rawEarningsBalance.eq(0) || pendingTx}
        onClick={async () => {
          const receipt = await fetchWithCatchTxError(() => {
            return onReward()
          })
          if (receipt?.status) {
            toastSuccess(
              `${t('Harvested')}!`,
              <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                {t('Your %symbol% earnings have been sent to your wallet!', { symbol: '' })}
              </ToastDescriptionWithTx>,
            )
            dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
          }
        }}
      >
        {pendingTx ? t('Harvesting') : t('Harvest')}
      </UIButton.UIStyledButton>
    </Flex>
  )
}

export default HarvestAction
