import BigNumber from 'bignumber.js'

import { CardBody, Flex, Text, CardRibbon } from 'packages/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import { TokenPairImage } from 'components/TokenImage'
import styled from 'styled-components'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: DeserializedPool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  const isCakePool = earningToken.symbol === 'MTS' && stakingToken.symbol === 'TABI'

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished && sousId !== 0}>
        <PoolCardHeaderTitle
          title={isCakePool ? t('Manual') : t('Earn %asset%', { asset: earningToken.symbol })}
          subTitle={isCakePool ? t('Earn TABI, stake TABI') : t('Stake %symbol%', { symbol: stakingToken.symbol })}
        />
        <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
      </PoolCardHeader>
      <StyledCardBody>
        <Flex flexDirection="column" height="100%">
          <AprRow pool={pool} stakedBalance={stakedBalance} />
          <Flex mt="auto" flexDirection="column">
            {account ? (
              <CardActions pool={pool} stakedBalance={stakedBalance} />
            ) : (
              <Flex flexDirection="column" mt="auto" height="100%">
                <Text mb="10px" fontSize="14px" color="textSubtle">
                  {t('Start earning')}
                </Text>
                <ConnectWalletButton />
              </Flex>
            )}
          </Flex>
        </Flex>
      </StyledCardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard

const StyledCardBody = styled(CardBody)`
  height: 100%;
`
