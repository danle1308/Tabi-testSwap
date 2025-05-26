import { Box, Button, Heading, Skeleton, Text } from 'packages/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import tokens from 'config/constants/tokens'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import styled from 'styled-components'
import { UIButton } from 'components/TabiSwap/components/ui'
import { FarmWithStakedValue } from '../../types'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const StyledButton = styled(Button)`
  height: 39px;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 10px;
`

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  height: 100%;
`

const USD = styled.div`
  color: ${({ theme }) => theme.colors.WhiteColor};
  opacity: 0.4;
`
const StyledActionContainer = styled(ActionContainer)`
  border: none;
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 0;
  background: none;
  border-radius: 0;
  width: 100%;
`

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady }) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = new BigNumber(userData.earnings)
  const cakePrice = usePriceCakeBusd()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(2, BigNumber.ROUND_DOWN)
  }

  const { onReward } = useHarvestFarm(pid)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  return (
    <StyledActionContainer>
      <ActionContent>
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          <ActionTitles>
            {/* <Text color="#737373" fontSize="14px" pr="4px">
          {tokens.cake.symbol}
        </Text> */}
            <Text color="#737373" fontSize="14px">
              {t('Reward')}
            </Text>
          </ActionTitles>
          <BalanceWrapper>
            <Heading color="Black">{displayBalance}</Heading>
            {/* {earningsBusd > 0 && (
              <USD>
                <Balance fontSize="12px" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
              </USD>
            )} */}
            <Text color="#737373" fontSize="14px" pr="4px">
              {tokens.cake.symbol}
            </Text>
          </BalanceWrapper>
        </Box>
        <StyledButton
          disabled={earnings.eq(0) || pendingTx || !userDataReady}
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
          ml="4px"
        >
          {pendingTx ? t('Harvesting') : t('Harvest')}
        </StyledButton>
      </ActionContent>
    </StyledActionContainer>
  )
}

export default HarvestAction
