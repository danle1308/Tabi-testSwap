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
import Column from 'components/Layout/Column'
import Row from 'components/Layout/Row'
import { ActionContainer, ActionTitles, ActionContent } from './styles'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import TotalStakedCell from '../Cells/TotalStakedCell'

const Title = styled(Text)`
  color: var(--color-grey-border-input);
`

const RestyledActionContainer = styled(ActionContainer)`
  flex-direction: row;
  justify-content: space-between;
  min-height: 80px;
  align-items: flex-end;
`

const HarvestAction: React.FunctionComponent<DeserializedPool> = ({
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
    height: 39px;
    width: 152px;
    font-weight: 500;
    font-size: 14px;
    border-radius: 10px;
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

  const actionTitle = (
    <>
      <Title fontSize="14px" as="span">
        {t('Reward')}
      </Title>
    </>
  )

  if (!account) {
    return (
      <RestyledActionContainer>
        <Column height="100%">
          <ActionTitles>{actionTitle}</ActionTitles>
          <Row>
            <Text fontSize="14px" bold color="black">
              0
            </Text>
            <Text fontSize="14px" bold color="black" ml="4px">
              {earningToken.symbol}
            </Text>
          </Row>
        </Column>
        <Flex height="auto">
          <HarvestButton disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</HarvestButton>
        </Flex>
      </RestyledActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <RestyledActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </RestyledActionContainer>
    )
  }

  return (
    <RestyledActionContainer>
      <Column height="100%" style={{ gap: '13px' }}>
        <ActionTitles>{actionTitle}</ActionTitles>
        <Row>
          {hasEarnings ? (
            <>
              <Balance lineHeight="1" bold fontSize={['14px']} decimals={5} value={earningTokenBalance} color="black" />
              <Text fontSize="14px" bold color="black" ml="4px">
                {earningToken.symbol}
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="14px" bold color="black">
                0
              </Text>
              <Text fontSize="14px" bold color="black" ml="4px">
                {earningToken.symbol}
              </Text>
            </>
          )}
        </Row>
      </Column>
      <ActionContent>
        <HarvestButton disabled={!hasEarnings} onClick={onPresentCollect}>
          {isCompoundPool ? t('Collect') : t('Harvest')}
        </HarvestButton>
      </ActionContent>
    </RestyledActionContainer>
  )
}

export default HarvestAction
