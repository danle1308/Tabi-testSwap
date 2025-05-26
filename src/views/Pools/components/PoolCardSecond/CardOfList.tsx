import { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Flex, Text } from 'packages/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { TokenPairImage } from 'components/TokenImage'
import Row, { RowBetween } from 'components/Layout/Row'
import Column from 'components/Layout/Column'
import { getBalanceNumber } from 'utils/formatBalance'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  onClick?: () => void
}

const CardFlex = styled(Flex)`
  flex-direction: column;
  background: #888888;
  width: 100%;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;

  :hover {
    transition: 200ms;
    background: #686868;
  }
`

const Title = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: black;
`

const NameCol = styled(Text)`
  color: var(--color-text-third);
  font-weight: 500;
`

const Number = styled(Text).attrs(() => ({
  fontSize: ['18px'],
  fontWeight: '700',
}))``

const CardOfList: React.FC<PoolRowProps> = ({ pool, account, onClick }) => {
  const { t } = useTranslation()
  const {
    sousId,
    stakingToken,
    earningToken,
    userData,
    isFinished,
    vaultKey,
    contractAddress,
    totalStaked,
    stakingTokenPrice,
  } = pool
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop, isMobile } = useMatchBreakpoints()

  const earningTokenSymbol = earningToken.symbol
  const totalStakedUsdValue = getBalanceNumber(totalStaked.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  return (
    <>
      <CardFlex onClick={onClick}>
        <Row>
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} mr="8px" width={30} height={30} />
          <Flex style={{ gap: '0' }}>
            <Title>Earn</Title>
            <Title ml="4px">{t(`%symbol%`, { symbol: earningTokenSymbol })}</Title>
          </Flex>
        </Row>
        <RowBetween>
          <Column>
            <NameCol>TVL</NameCol>
            <Number>{t(`%total% $`, { total: totalStakedUsdValue || 0 })}</Number>
          </Column>
          <Column>
            <NameCol textAlign="end">APY</NameCol>
            <Number>$00000</Number>
          </Column>
        </RowBetween>
      </CardFlex>
    </>
  )
}

export default CardOfList
