import React from 'react'
import { CurrencyLogo } from 'components/Logo'
import styled from 'styled-components'
import { Flex, Box } from '../Box'
import Text from '../Text/Text'
import { StyledBalanceInput, StyledInput, UnitContainer, SwitchUnitsButton } from './styles'
import { BalanceInputProps } from './types'

interface SecondBalanceInPutProp {
  stakingToken: any
}

const RestyledBalanceInput = styled(StyledBalanceInput)`
  background-color: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 0px;
`

const SecondBalanceInput: React.FC<BalanceInputProps & SecondBalanceInPutProp> = ({
  value,
  placeholder = '0.0',
  onUserInput,
  currencyValue,
  inputProps,
  innerRef,
  isWarning = false,
  decimals = 18,
  unit,
  switchEditingUnits,
  stakingToken,
  ...props
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      onUserInput(e.currentTarget.value.replace(/,/g, '.'))
    }
  }

  return (
    <RestyledBalanceInput isWarning={isWarning} {...props}>
      <Flex alignItems="center" minWidth="70px">
        <CurrencyLogo currency={stakingToken} size="25px" />
        <Text bold fontSize="14px" color="black">
          {stakingToken.symbol}
        </Text>
      </Flex>
      <Flex justifyContent="flex-end">
        <Box>
          <Flex alignItems="center">
            <StyledInput
              pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
              inputMode="decimal"
              min="0"
              value={value}
              onChange={handleOnChange}
              placeholder={placeholder}
              ref={innerRef}
              textAlign="left"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'black',
              }}
              {...inputProps}
            />
            {unit && <UnitContainer color="WhiteColorLight">{unit}</UnitContainer>}
          </Flex>
        </Box>
      </Flex>
    </RestyledBalanceInput>
  )
}

export default SecondBalanceInput
