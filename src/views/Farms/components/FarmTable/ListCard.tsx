import { useState } from 'react'
import { Token } from '@tabi-dex/sdk'
import styled from 'styled-components'
import { useMatchBreakpoints, Flex, Text } from 'packages/uikit'
import { DeserializedFarm, DeserializedPool, VaultKey } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { TokenPairImage } from 'components/TokenImage'
import Row, { RowBetween } from 'components/Layout/Row'
import Column from 'components/Layout/Column'
import { getBalanceNumber } from 'utils/formatBalance'
import Liquidity, { LiquidityProps } from './Liquidity'
import Apr, { AprProps } from './Apr'
import FarmModal, { FarmProps } from './FarmModal'
import LiquidityModal from './LiquidityModal'

interface FarmRowProps {
  account: string
  onClick?: () => void
  farm: FarmProps
  liquidity: LiquidityProps
  apr: AprProps
  token: Token
  quoteToken: Token
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

const ListCard: React.FC<FarmRowProps> = ({ farm, onClick, liquidity, apr }) => {
  const { t } = useTranslation()

  const { quoteToken, token } = farm
  // const farms.map(farm)
  // const { stakingToken, totalStaked, stakingTokenPrice } = farms
  // const totalStakedUsdValue = getBalanceNumber(totalStaked.multipliedBy(stakingTokenPrice), stakingToken.decimals)
  // console.log('totalStakedUsdValue', totalStakedUsdValue)
  return (
    <>
      <CardFlex onClick={onClick}>
        <Row>
          <Flex style={{ gap: '0' }}>
            <FarmModal {...farm} />
          </Flex>
        </Row>
        <RowBetween style={{ width: '100%' }}>
          <Column>
            <NameCol>TVL</NameCol>
            <LiquidityModal quoteToken={quoteToken} token={token} {...liquidity} />
          </Column>
          <Column>
            <NameCol textAlign="end">APY</NameCol>
            <Apr {...apr} />
          </Column>
        </RowBetween>
      </CardFlex>
    </>
  )
}

export default ListCard
