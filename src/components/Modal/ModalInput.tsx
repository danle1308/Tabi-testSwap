import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { parseUnits } from '@ethersproject/units'
import { formatBigNumber } from 'utils/formatBalance'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.dropdownDeep};
  /* box-shadow: ${getBoxShadow}; */
  color: ${({ theme }) => theme.colors.text};
  padding: 16px;
  width: 100%;
  border-radius: 10px;
`

const StyledInput = styled(Input)`
  background: ${({ theme }) => theme.colors.InvertedContrastColor};
  box-shadow: none;
  border: none;
  border-radius: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const StyledErrorMessage = styled(Text)`
  a {
    display: inline;
  }
`

const StyledInputWrapper = styled.div`
  position: relative;
`

const MaxButton = styled(Button)`
  background-color: transparent;
  position: absolute;
  right: 0;
  top: calc(50% - 16px);
  color: var(--core-color);
  font-size: 0.875rem;
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
}) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }

    const balanceUnits = parseUnits(balance, decimals)
    return formatBigNumber(balanceUnits, 6, decimals)
  }

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between">
          <Text fontSize="14px">{inputTitle}</Text>
          <Text fontSize="14px">{t('Balance: %balance%', { balance: displayBalance(max) })}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-around">
          <StyledInputWrapper>
            <StyledInput
              pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
              inputMode="decimal"
              step="any"
              min="0"
              onChange={onChange}
              placeholder="0"
              value={value}
            />
            <MaxButton scale="sm" onClick={onSelectMax}>
              {t('Max')}
            </MaxButton>
          </StyledInputWrapper>
          <Text fontSize={['0.675rem']}>{symbol}</Text>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure" mt="6px">
          {t('No tokens to stake')}:{' '}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {t('Get %symbol%', { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
