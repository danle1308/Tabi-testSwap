import { Currency, Pair, Token, Percent } from '@tabi-dex/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, MetamaskIcon, useMatchBreakpoints } from 'packages/uikit'
import styled from 'styled-components'
import { registerToken } from 'utils/wallet'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Field } from 'state/burn/actions'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'
import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-right: 1rem;
  }
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0.5rem 0 0;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 0.5rem;
  }
`

const TextPercent = styled(Text)`
  font-size: 8px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textBlur};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 12px;
  }
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  width: 100%;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  z-index: 1;
  background-size: contain;
  background: rgba(115, 115, 115, 1);
  border-radius: 8px;
`
const Container = styled.div`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 53px;
  }
`
const PercentButton = styled(Button).attrs({ variant: 'text', px: '6px' })`
  height: 30px;
  padding: 0px 5px;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 48px;
  }
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
export default function CurrencyInputPanel({
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
  ...props
}: CurrencyInputPanelProps) {
  const { account, library } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

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
    <Box position="relative" id={id} {...props}>
      <Flex mb="6px" alignItems="center" justifyContent="space-between">
        <Flex>
          <CurrencySelectButton
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            {showCurrency && (
              <Flex alignItems="center" justifyContent="space-between" style={{ gap: isMobile ? '4px' : '0.5rem' }}>
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                ) : currency ? (
                  <CurrencyLogo
                    currency={currency}
                    size={isMobile ? '17px' : '24px'}
                    style={{ marginRight: isMobile ? '0px' : '8px' }}
                  />
                ) : null}
                {pair ? (
                  <Text fontSize={isMobile ? '10px' : '14px'} style={{ color: 'white' }} id="pair" bold>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text fontSize={isMobile ? '10px' : '14px'} style={{ color: 'white' }} id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || (
                      <Text style={{ color: 'white', fontSize: isMobile ? '10px' : '14px' }} id="pair" fontWeight="400">
                        {t('Select a token')}
                      </Text>
                    )}
                  </Text>
                )}
                {!disableCurrencySelect && <ChevronDownIcon color="text" width={isMobile ? '9px' : '18px'} />}
              </Flex>
            )}
          </CurrencySelectButton>
          {token && tokenAddress && showCurrency ? (
            <Flex style={{ gap: '4px' }} alignItems="center">
              <CopyButton
                width={isMobile ? '8px' : '16px'}
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
                  width={isMobile ? '12px' : '16px'}
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
        </Flex>
        {account && (
          <Flex>
            <Text fontSize={['8px', , , , '12px']} color="textBlur" style={{ display: 'inline', cursor: 'pointer' }}>
              Balance:
            </Text>
            <Text onClick={onMax} fontSize={['8px', , , , '12px']} style={{ display: 'inline', cursor: 'pointer' }}>
              {!hideBalance && !!currency
                ? t('%balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                : ''}
            </Text>
          </Flex>
        )}
      </Flex>
      <InputPanel>
        <Container>
          <LabelRow>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
              style={{
                width: '100%',
                fontSize: isMobile ? '10px' : '16px',
                padding: isMobile ? '0px 10px' : '16px',
              }}
            />
          </LabelRow>
          <InputRow selected={disableCurrencySelect}>
            {account && currency && showMaxButton && label !== 'To' && (
              <Button
                variant="text"
                onClick={onMax}
                scale="sm"
                style={{ padding: '0px', fontSize: isMobile ? '10px' : '16px' }}
              >
                {t('Max')}
              </Button>
            )}
          </InputRow>
        </Container>
      </InputPanel>
      {isQuickButton ? (
        <>
          {['25', '50', '75', '100'].map((per) => (
            <PercentButton onClick={() => onPercentBalance(per)}>
              <TextPercent>{per}%</TextPercent>
            </PercentButton>
          ))}
          {/* <PercentButton onClick={onMax}>
            <TextPercent>Max</TextPercent>
          </PercentButton> */}
        </>
      ) : null}
    </Box>
  )
}
