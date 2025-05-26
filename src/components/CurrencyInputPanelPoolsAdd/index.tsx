import { Currency, Pair, Token, Percent } from '@tabi-dex/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, MetamaskIcon, useMatchBreakpoints } from 'packages/uikit'
import styled from 'styled-components'
import { registerToken } from 'utils/wallet'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Field } from 'state/burn/actions'
import DoubleLogoPool from 'components/Logo/DoubleLogoPool'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'
import { Input as NumericalInputPools } from './NumericalInputPools'
import { CopyButton } from '../CopyButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  /* padding: 0 0.5rem; */
  background: var(--color-white-20);
  border-radius: 20px;
`
const LabelRow = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  line-height: 1rem;
  width: 100%;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  background-size: contain;
  /* background: rgba(115, 115, 115, 1); */
  border-radius: 8px;
`
const Container = styled.div`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const Containers = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: flex-end;
  margin: auto;
  width: 100%;
  margin-right: 0;
`
const PercentButton = styled(Button).attrs({ variant: 'text' })`
  padding: 0px;
  height: 0;
  margin-left: 0.3rem;
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  showCurrency?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  isQuickButton?: boolean
}
export default function CurrencyInputPanelPools({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  showCurrency = true,
  hideBalance = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  isQuickButton,
  align,
}: CurrencyInputPanelProps) {
  const { account, library } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  // eslint-disable-next-line consistent-return
  const onPercentBalance = (percentValue: string) => {
    if (!selectedCurrencyBalance) return '0'
    const result = selectedCurrencyBalance?.multiply(percentValue).divide('100')
    onUserInput(result.toSignificant(6))
  }

  // const balance = parseFloat(selectedCurrencyBalance?.toSignificant(6))

  // const onPercentBalance = (percent) => {
  //   if (percent >= 0 && percent <= 1 && balance !== undefined) {
  //     const percentValue = balance * percent
  //     onUserInput(percentValue.toString())
  //   }
  // }

  return (
    <Box position="relative" id={id}>
      <Flex mb="6px" alignItems="center" justifyContent="space-between">
        <Flex>
          <CurrencySelectButton
            className="open-currency-select-button"
            selected={!!currency}
            onClick={!disableCurrencySelect ? () => onPresentCurrencyModal() : undefined}
            style={{
              cursor: disableCurrencySelect ? 'default' : 'pointer',
              pointerEvents: disableCurrencySelect ? 'none' : 'auto',
              opacity: disableCurrencySelect ? 0.9 : 1,
            }}
          >
            {showCurrency && (
              <Flex alignItems="center" justifyContent="space-between">
                {pair ? (
                  <DoubleLogoPool currency0={pair.token0} currency1={pair.token1} size={20.7} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="20.7px" style={{ marginRight: '-4px' }} />
                ) : null}
                {pair ? (
                  <Text style={{ color: 'white', fontWeight: '500' }} id="pair" bold>
                    {pair?.token0.symbol}/{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text style={{ color: 'white', fontWeight: '500' }} id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t('Select a currency')}
                  </Text>
                )}
                {token && tokenAddress && showCurrency ? (
                  <Flex style={{ gap: '4px' }} alignItems="center">
                    <CopyButton
                      width="16px"
                      buttonColor="textSubtle"
                      text={tokenAddress}
                      tooltipMessage={t('Token address copied')}
                      tooltipTop={-20}
                      tooltipRight={40}
                      tooltipFontSize={12}
                    />
                    {library?.provider?.isMetaMask && (
                      <MetamaskIcon
                        style={{ cursor: 'pointer' }}
                        width="16px"
                        onClick={() =>
                          registerToken(
                            tokenAddress,
                            token.symbol,
                            token.decimals,
                            token instanceof WrappedTokenInfo ? token.logoURI : undefined,
                          )
                        }
                      />
                    )}
                  </Flex>
                ) : null}
                {/* {disableCurrencySelect && <ChevronDownIcon color="text" />} */}
                <ChevronDownIcon color="text" />
              </Flex>
            )}
          </CurrencySelectButton>
          {/* {token && tokenAddress && showCurrency ? (
                        <Flex style={{ gap: '4px' }} alignItems="center">
                            <CopyButton
                                width="16px"
                                buttonColor="textSubtle"
                                text={tokenAddress}
                                tooltipMessage={t('Token address copied')}
                                tooltipTop={-20}
                                tooltipRight={40}
                                tooltipFontSize={12}
                            />
                            {library?.provider?.isMetaMask && (
                                <MetamaskIcon
                                    style={{ cursor: 'pointer' }}
                                    width="16px"
                                    onClick={() =>
                                        registerToken(
                                            tokenAddress,
                                            token.symbol,
                                            token.decimals,
                                            token instanceof WrappedTokenInfo ? token.logoURI : undefined,
                                        )
                                    }
                                />
                            )}
                        </Flex>
                    ) : null} */}
        </Flex>
      </Flex>
      <InputPanel>
        <Container>
          <LabelRow>
            <NumericalInputPools
              align={align}
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
              style={{ width: '100%' }}
            />
            {/* <Text color="#9B9B9B" fontSize="14px" fontWeight="300">
              $0.00
            </Text> */}
          </LabelRow>
          {/* <InputRow selected={disableCurrencySelect}>
            {account && currency && showMaxButton && label !== 'To' && (
              <Button variant="text" onClick={onMax} scale="xs">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow> */}
        </Container>
        <Containers>
          {account && (
            <Text
              onClick={onMax}
              color="var(--color-white-80)"
              fontSize="12px"
              style={{ display: 'inline', cursor: 'pointer' }}
            >
              {!hideBalance && !!currency && (
                <>
                  <span style={{ fontWeight: '400' }}>Balance: </span>
                  <span style={{ fontWeight: '700' }}>{selectedCurrencyBalance?.toSignificant(6) ?? t('Loading')}</span>
                </>
              )}
            </Text>
          )}
          {!isQuickButton ? (
            <Box style={{ padding: '0' }}>
              {['25', '50'].map((per) => (
                <PercentButton onClick={() => onPercentBalance(per)}>
                  <Text
                    style={{
                      background: '#FE0034',
                      width: '30px',
                      height: '14px',
                      fontWeight: '400',
                      fontSize: '8px',
                      borderRadius: '10px',
                    }}
                  >
                    {per}%
                  </Text>
                </PercentButton>
              ))}
              <PercentButton onClick={onMax}>
                <Text
                  style={{
                    background: '#FE0034',
                    width: '30px',
                    height: '14px',
                    fontWeight: '400',
                    fontSize: '8px',
                    borderRadius: '10px',
                  }}
                >
                  Max
                </Text>
              </PercentButton>
            </Box>
          ) : null}
        </Containers>
      </InputPanel>
    </Box>
  )
}
