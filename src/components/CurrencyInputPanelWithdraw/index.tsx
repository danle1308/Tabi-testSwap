import { Currency, Pair, Token, Percent } from '@tabi-dex/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, MetamaskIcon } from 'packages/uikit'
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
  padding-right: 1rem;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0rem;
`

const TextPercent = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textBlur};
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
  border-radius: 8px;
`
const Container = styled.div`
  border-radius: 16px;
  /* box-shadow: ${({ theme }) => theme.shadows.inset}; */

  display: flex;
  align-items: center;
  justify-content: space-between;
`
const PercentButton = styled(Button).attrs({ variant: 'text', px: '6px' })``
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
  disableCurrencySelect = true,
  showCurrency = true,
  hideBalance = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  isQuickButton,
  align,
  justifyContent,
}: CurrencyInputPanelProps) {
  const { account, library } = useActiveWeb3React()
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
    <Box position="relative" id={id}>
      <Flex mb="6px" alignItems="center" justifyContent={justifyContent}>
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
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20.7} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="20.7px" style={{ marginRight: '3px' }} />
                ) : null}
                {pair ? (
                  <Text style={{ color: 'white' }} id="pair" bold>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text style={{ color: 'white' }} id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || (
                      <Text style={{ color: 'white' }} id="pair" fontWeight="400">
                        {t('Select a token')}
                      </Text>
                    )}
                  </Text>
                )}
                {/* {!disableCurrencySelect && <ChevronDownIcon color="text" />} */}
              </Flex>
            )}
          </CurrencySelectButton>
        </Flex>
        {!account && (
          <Flex>
            <Text fontSize="12px" color="textBlur" style={{ display: 'inline', cursor: 'pointer' }}>
              Balance:
            </Text>
            <Text onClick={onMax} fontSize="12px" style={{ display: 'inline', cursor: 'pointer' }}>
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
              align={align}
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
              style={{ width: '100%' }}
            />
          </LabelRow>
        </Container>
      </InputPanel>
      {!isQuickButton ? (
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
