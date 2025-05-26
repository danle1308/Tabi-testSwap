import { Button, Text, useModal, Flex, Skeleton, Heading } from 'packages/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { UIButton } from 'components/TabiSwap/components/ui'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween } from 'components/Layout/Row'
import { ActionContainer, ActionTitles, ActionContent } from './styles'
import CollectModal from '../../PoolCard/Modals/CollectModal'

const RestyledActionContainer = styled(ActionContainer)`
  padding: 0px;
  margin: 0px;
  max-width: 100%;
  gap: 0px;
  justify-content: center;
  background-color: transparent;
`

const Titles = styled(Text)`
  color: black;
  font-size: 14px;
`

const Number = styled(Heading)`
  color: var(--color-red);
`

const TokenSymbol = styled(Text)`
  color: black;
`

const HarvestSecond: React.FunctionComponent<DeserializedPool> = ({
  sousId,
  poolCategory,
  earningToken,
  userData,
  userDataLoaded,
  earningTokenPrice,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const isCompoundPool = sousId === 0
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  const HarvestButton = styled(Button)`
    height: 35px;
    font-weight: 500;
    font-size: 0.875rem;
  `

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const actionTitle = <>{t(`Token Reward`)}</>
  if (!account) {
    return (
      <RestyledActionContainer>
        <Titles>{actionTitle}</Titles>
        <RowBetween alignItems="center">
          <Number>0</Number>
          <Flex>
            <CurrencyLogo currency={earningToken} size="18px" />
            <TokenSymbol bold mr="3rem">
              {earningToken.symbol}
            </TokenSymbol>
          </Flex>
          {/* <HarvestButton disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</HarvestButton> */}
        </RowBetween>
      </RestyledActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <RestyledActionContainer>
        <Titles>{actionTitle}</Titles>
        <ActionContent>
          <Skeleton width={180} height="22px" />
        </ActionContent>
      </RestyledActionContainer>
    )
  }

  return (
    <RestyledActionContainer>
      <Titles>{actionTitle}</Titles>
      <ActionContent>
        <Flex flex="1" alignSelf="flex-center" justifyContent="space-between">
          <>
            {hasEarnings ? (
              <>
                <Balance
                  lineHeight="1"
                  bold
                  fontSize="20px"
                  decimals={4}
                  value={earningTokenBalance}
                  color="var(--color-red)"
                />
                <Flex mr="1rem">
                  <CurrencyLogo currency={earningToken} size="18px" />
                  <TokenSymbol bold>{earningToken.symbol}</TokenSymbol>
                </Flex>
                {/* {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )} */}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                {/* <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text> */}
              </>
            )}
          </>
        </Flex>
        {/* <HarvestButton disabled={!hasEarnings} onClick={onPresentCollect}>
          {isCompoundPool ? t('Collect') : t('Harvest')}
        </HarvestButton> */}
      </ActionContent>
    </RestyledActionContainer>
  )
}

export default HarvestSecond
