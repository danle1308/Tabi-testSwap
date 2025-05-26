import { useState } from 'react'
import { JSBI, Pair, Percent } from '@tabi-dex/sdk'
import {
  Button,
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
  Card,
  CardBody,
  Flex,
  CardProps,
  AddIcon,
  Box,
  Link,
  useMatchBreakpoints,
} from 'packages/uikit'
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FlexRow from 'views/Predictions/components/FlexRow'
import { UIButton } from 'components/TabiSwap/components/ui'
import { useRouter } from 'next/router'
import useTotalSupply from '../../hooks/useTotalSupply'

import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import { BIG_INT_ZERO } from '../../config/constants'
import Dots from '../Loader/Dots'

const FixedHeightRow = styled(RowBetween)``

const StyledLightCard = styled(LightCard)`
  background-color: transparent;
  padding: 10px;
`

const StyledCardBody = styled(CardBody)`
  /* background-color: ${({ theme, isAddPage }) =>
    `${isAddPage ? `${theme.colors.ModalBg}` : `${theme.colors.InvertedContrastColor}`}`}; */
  padding: 0px;
`

const RemoveLiquidityButton = styled(NextLinkFromReactRouter)``

const AddLiquiInsteadButton = styled(NextLinkFromReactRouter)`
  /* background: transparent;
  color: ${({ theme }) => theme.colors.WhiteColor}; */
  font-size: 14px;
  font-weight: 400;
`

const FullPositionStyledCard = styled(StyledLightCard)`
  /* background-color: ${({ theme }) => theme.colors.InvertedContrastColor}; */
  /* padding: 20px; */
  display: flex;
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const { isMobile } = useMatchBreakpoints()

  const isAdd = router.pathname === '/add/[[...currency]]'

  const { t } = useTranslation()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <>
          <StyledCardBody isAddPage={isAdd}>
            <AutoColumn gap="8px">
              {/* <FixedHeightRow>
                <RowFixed>
                  <Text color="var(--color-white-80)" fontWeight="400" fontSize="14px">
                    {t('Your Position')}
                  </Text>
                </RowFixed>
              </FixedHeightRow> */}
              <Box
                style={{
                  border: '0.5px solid var(--color-white-50)',
                  borderRadius: '5px',
                  padding: '13px',
                  minHeight: isMobile ? 'auto' : '128px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                  <RowFixed>
                    <Text
                      style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400' }}
                      color="var(--color-white-80)"
                    >
                      {currency0.symbol}-{currency1.symbol} LP
                    </Text>
                  </RowFixed>
                  <RowFixed>
                    <Text
                      style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}
                      color="var(--color-white-80)"
                    >
                      {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                    </Text>
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20.7} />
                  </RowFixed>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text
                    style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400' }}
                    color="var(--color-white-80)"
                  >
                    {t('Staked %asset%', { asset: currency0.symbol })}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text
                        style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}
                        color="var(--color-white-80)"
                        mr="6px"
                      >
                        {token0Deposited?.toSignificant(6)}
                      </Text>
                      <Text style={{ fontSize: isMobile ? '10px' : '14px' }}>
                        {t('%asset%', { asset: currency0.symbol })}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text
                    style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400' }}
                    color="var(--color-white-80)"
                  >
                    {t('Staked %asset%', { asset: currency1.symbol })}:
                  </Text>
                  {token1Deposited ? (
                    <RowFixed style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}>
                      <Text
                        style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}
                        color="var(--color-white-80)"
                        mr="6px"
                      >
                        {token1Deposited?.toSignificant(6)}
                      </Text>
                      <Text style={{ fontSize: isMobile ? '10px' : '14px' }}>
                        {t('%asset%', { asset: currency1.symbol })}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text
                    style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '400' }}
                    color="var(--color-white-80)"
                  >
                    {t('Your pool share')}:
                  </Text>
                  <Text
                    style={{ fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}
                    color="var(--color-white-80)"
                  >
                    {poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}
                  </Text>
                </FixedHeightRow>
              </Box>
            </AutoColumn>
          </StyledCardBody>
        </>
      ) : (
        <StyledLightCard>
          <Text
            color="var(--color-white-80)"
            fontSize={isMobile ? '10px' : '14px'}
            style={{ display: 'flex', gap: '5px' }}
          >
            <span role="img" aria-label="pancake-icon">
              🥞
            </span>{' '}
            {t(
              "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </StyledLightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, ...props }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <FullPositionStyledCard {...props}>
      <FlexRow
        justifyContent="space-between"
        role="button"
        // onClick={() => setShowMore(!showMore)}
        style={{ marginBottom: `${showMore ? '16px' : '0'}` }}
      >
        <Flex flexDirection="column">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text style={{ fontSize: '14px', fontWeight: '400' }}>
              {!currency0 || !currency1 ? <Dots>{t('Loading')}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
          {/* <Text fontSize="14px" color="textSubtle">
            {userPoolBalance?.toSignificant(4)}
          </Text> */}
        </Flex>
        <FixedHeightRow>
          {/* <Text color="textSubtle">{t('Share of Pool')}</Text> */}
          <Text style={{ fontSize: '14px', fontWeight: '400' }}>
            {poolTokenPercentage
              ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
              : '-'}
          </Text>
        </FixedHeightRow>
      </FlexRow>

      <AutoColumn gap="8px" style={{ display: 'flex' }}>
        {/* <FixedHeightRow>
          <RowFixed>
            <CurrencyLogo size="30px" currency={currency0} />
            <Text color="textSubtle" ml="4px">
              {t('Pooled %asset%', { asset: currency0.symbol })}:
            </Text>
          </RowFixed>
          {token0Deposited ? (
            <RowFixed>
              <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
            </RowFixed>
          ) : (
            '-'
          )}
        </FixedHeightRow> */}

        {/* <FixedHeightRow>
          <RowFixed>
            <CurrencyLogo size="30px" currency={currency1} />
            <Text color="textSubtle" ml="4px">
              {t('Pooled %asset%', { asset: currency1.symbol })}:
            </Text>
          </RowFixed>
          {token1Deposited ? (
            <RowFixed>
              <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
            </RowFixed>
          ) : (
            '-'
          )}
        </FixedHeightRow> */}
        <Flex style={{ textAlign: 'center', border: 'none' }}>
          <Link href="/add" passHref>
            <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="black" />}>
              {t('Add Liquidity')}
            </Button>
          </Link>
        </Flex>
        {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
          <Flex flexDirection="column">
            <UIButton.UIStyledActionButton
              as={RemoveLiquidityButton}
              to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              width="100%"
              mb="8px"
            >
              {t('Remove')}
            </UIButton.UIStyledActionButton>

            <Button
              as={AddLiquiInsteadButton}
              to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
              startIcon={<AddIcon color="WhiteColor" />}
              width="100%"
            >
              {t('Add liquidity instead')}
            </Button>
          </Flex>
        )}
      </AutoColumn>
    </FullPositionStyledCard>
  )
}
