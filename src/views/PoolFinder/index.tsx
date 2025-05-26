import { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@tabi-dex/sdk'
import { Button, ChevronDownIcon, Text, AddIcon, useModal, ArrowDownIcon, NewArrowDown } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NextLinkFromReactRouter } from 'components/NextLink'
// import { LabelText } from 'components/NetworkSwitcher/Wrapper'
import { BodyWrapper } from 'components/App/AppBody'
import { UIButton } from 'components/TabiSwap/components/ui'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import { CurrencyLogo } from '../../components/Logo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Layout/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../hooks/usePairs'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledButton = styled(Button)`
  border-radius: 8px;
`

const StyledBody = styled(BodyWrapper)`
  max-width: 485px;
`

const PositionPage = styled(Page)``

const StyledButtonManage = styled(NextLinkFromReactRouter)`
  text-align: center;
  padding: 12px 24px;
  min-height: 72px;
`

const PrerequisiteMessageWrapper = styled(Button)`
  /* border: 1px solid ${({ theme }) => theme.colors.MainColor}; */
  margin-top: 16px;
`

export default function PoolFinder() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)),
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <PrerequisiteMessageWrapper>
      <Text textAlign="center" color="BlackColor">
        {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
      </Text>
    </PrerequisiteMessageWrapper>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <PositionPage>
      <StyledBody>
        <AppHeader title={t('Import Pool')} subtitle={t('Import an existing pool')} backTo="/liquidity" />
        <AutoColumn style={{ padding: '0 1rem 2rem' }} gap="md">
          {/* <LabelText style={{ color: 'black' }}>
            {t('Select a currency')} <NewArrowDown isDark={false} />
          </LabelText> */}

          <StyledButton
            endIcon={<ChevronDownIcon color="WhiteColor" />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN0)
            }}
          >
            {currency0 ? (
              <Row>
                <CurrencyLogo currency={currency0} />
                <Text color="BlackColor" ml="8px">
                  {currency0.symbol}
                </Text>
              </Row>
            ) : (
              <Text color="BlackColor" ml="8px">
                {t('Select a Token')}
              </Text>
            )}
          </StyledButton>

          <ColumnCenter>
            <AddIcon style={{ border: '2px solid #fff', borderRadius: '50px' }} width="20px" />
          </ColumnCenter>

          {/* <LabelText style={{ color: 'black' }}>
            {t('Select a currency')} <NewArrowDown isDark={false} />
          </LabelText> */}

          <StyledButton
            endIcon={<ChevronDownIcon color="WhiteColor" />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN1)
            }}
          >
            {currency1 ? (
              <Row>
                <CurrencyLogo currency={currency1} />
                <Text color="BlackColor" ml="8px">
                  {currency1.symbol}
                </Text>
              </Row>
            ) : (
              <Text color="BlackColor" as={Row}>
                {t('Select a Token')}
              </Text>
            )}
          </StyledButton>

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <>
                  <MinimalPositionCard pair={pair} />
                  <Button as={StyledButtonManage} to="/liquidity">
                    {t('Manage this pool')}
                  </Button>
                </>
              ) : (
                // <StyledLightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">{t('You don’t have liquidity in this pool yet.')}</Text>
                  <Button
                    width="100%"
                    // as={NextLinkFromReactRouter}
                    // to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    style={{ padding: '0 24px' }}
                  >
                    <NextLinkFromReactRouter to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      {t('Add Liquidity')}
                    </NextLinkFromReactRouter>
                  </Button>
                </AutoColumn>
                // </StyledLightCard>
              )
            ) : validPairNoLiquidity ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">{t('No pool found.')}</Text>
                  <Button
                    width="100%"
                    // as={NextLinkFromReactRouter}
                    // to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    variant="secondary"
                  >
                    <NextLinkFromReactRouter to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      {t('Create pool')}
                    </NextLinkFromReactRouter>
                  </Button>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.INVALID ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center" fontWeight={500}>
                    {t('Invalid pair.')}
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.LOADING ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    {t('Loading')}
                    <Dots />
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : (
            prerequisiteMessage
          )}
        </AutoColumn>

        {/* <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        /> */}
      </StyledBody>
    </PositionPage>
  )
}
