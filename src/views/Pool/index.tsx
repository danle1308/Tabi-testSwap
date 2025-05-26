import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, Box, useMatchBreakpoints } from 'packages/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BodyWrapper } from 'components/App/AppBody'
import { UIButton } from 'components/TabiSwap/components/ui'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppBody, AppHeader, AppLiqui } from '../../components/App'
import Page from '../Page'
import MainTable from './components/Table/MainTable'
import { useGetPools } from './hooks/useGetPools'

export enum View {
  ALL_POSITION,
}

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.BgColors};
  padding: 0px;
  /* border: 0.5px solid var(--color-white-50); */
  border-radius: 15px;
`

const StyledAppBody = styled.div`
  width: 100%;
  /* margin-top: 2rem; */
  background-color: ${({ theme }) => theme.colors.BgColors};
  ${({ theme }) => theme.mediaQueries.xs} {
    border-radius: 15px;
    border: 0.5px solid var(--color-white-50);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 15px;
    border: 0.5px solid var(--color-white-50);
  }
`

const ButtonLiqui = styled(UIButton.UIStyledActionButton)`
  max-width: 353px;
  width: 100%;
`

const ButtonAddLiqui = styled(UIButton.UIStyledActionButton)`
  min-height: 72px;
  font-weight: 800;
`

const PositionPage = styled(Page)`
  max-width: 1004px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  margin-top: 30px;

  &:after {
    position: relative;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    margin-top: 0px;
    padding: 20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 30px;
    padding: 0;
  }
`
const StyleTop = styled.div`
  /* background-color: ${({ theme }) => theme.colors.BgColors}; */
  /* background-color: blue; */
  padding: 20px;
  margin: auto;
  display: flex;
  gap: 3rem;
  border-bottom: 0.5px solid var(--color-white-50);

  th {
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0px;
  }
`
const NoAccountWrapper = styled(CardBody)`
  border: none;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  // fetch the user's balances of all tracked V2 LP tokens
  const { allV2PairsWithLiquidity, v2IsLoading, allV2Pairs } = useGetPools()
  const [view, setView] = useState(View.ALL_POSITION)

  const handleChangeView = (v: View) => setView(v)

  const renderBody = () => {
    return <MainTable pools={allV2Pairs} view={view} />
  }

  return (
    <PositionPage>
      <Box width="100%">
        <Text mb="10px" style={{ fontSize: isMobile ? '20px' : '32px', fontWeight: '800' }}>
          Pools
        </Text>
        <Text style={{ fontSize: isMobile ? '10px' : '16px', fontWeight: '300' }}>
          You can adjust and claim rewards for your liquidity positions on the connected network.
          <br /> For V2 pools, you can migrate to increase capital efficiency.
        </Text>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" padding={['16px 0']} />
      <StyledAppBody>
        <Body>{renderBody()}</Body>
      </StyledAppBody>
    </PositionPage>
  )
}
