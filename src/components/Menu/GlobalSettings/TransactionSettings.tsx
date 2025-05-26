import { useState } from 'react'
import { escapeRegExp } from 'utils'
import { Text, Button, Input, Flex, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import styled from 'styled-components'
import QuestionHelper from '../../QuestionHelper'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setTtl(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" style={{ gap: '0' }}>
            <Label>{t('Max Slippage')}</Label>
          </Flex>
          <Flex alignItems="center" height="auto">
            {/* <SlippageButton
            mt="4px"
            mr="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
            variant={userSlippageTolerance === 10 ? 'primary' : 'active'}
          >
            0.1%
          </SlippageButton>
          <SlippageButton
            mt="4px"
            mr="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
            variant={userSlippageTolerance === 50 ? 'primary' : 'active'}
          >
            0.5%
          </SlippageButton>
          <SlippageButton
            mr="4px"
            mt="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
            variant={userSlippageTolerance === 100 ? 'primary' : 'active'}
          >
            1.0%
          </SlippageButton> */}
            <SlippageButton
              scale="sm"
              onClick={() => {
                setSlippageInput('')
                setUserSlippageTolerance(50)
              }}
              variant="text"
              px={isMobile ? '0px' : '6px'}
              style={{
                height: 'auto',
              }}
            >
              <Text color="primary" fontSize={['8px', , , , '12px']} fontWeight="700">
                Auto
              </Text>
            </SlippageButton>
            <Flex
              alignItems="center"
              width={isMobile ? '45px' : '72px'}
              maxHeight={isMobile ? '18px' : '25px'}
              border="1px solid var(--color-white)"
              borderRadius="5px"
              style={{ gap: '0' }}
            >
              <TransactionInput
                scale="sm"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder={(userSlippageTolerance / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                }}
                onChange={(event) => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                  }
                }}
                isWarning={!slippageInputIsValid}
                isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
              />
              <Text fontSize={['8px', , , , 12]} color="var(--color-white-80)" mr="5px">
                %
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {!!slippageError && (
          <Text fontSize={['8px', , , , 12]} color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'}>
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </Text>
        )}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Label>{t('Tx Deadline')}</Label>
          {/* <QuestionHelper
            text={t('Your transaction will revert if it is left confirming for longer than this time.')}
            placement="top-start"
            ml="4px"
          /> */}
        </Flex>

        <Flex
          alignItems="center"
          width={isMobile ? '75px' : '120px'}
          maxHeight={isMobile ? '18px' : '25px'}
          border="1px solid var(--color-white)"
          borderRadius="5px"
        >
          <TransactionInput
            scale="sm"
            inputMode="numeric"
            pattern="^[0-9]+$"
            color={deadlineError ? 'red' : undefined}
            onBlur={() => {
              parseCustomDeadline((ttl / 60).toString())
            }}
            placeholder={(ttl / 60).toString()}
            value={deadlineInput}
            onChange={(event) => {
              if (event.currentTarget.validity.valid) {
                parseCustomDeadline(event.target.value)
              }
            }}
          />
          <Text fontSize={['8px', , , , 12]} color="var(--color-white-80)" mr="5px">
            minutes
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SlippageTabs

const SlippageButton = styled(Button)`
  border: 0;
  border-radius: 8px;
`

const TransactionInput = styled(Input)`
  height: 20px;
  border: 0;
  border-radius: 8px;
  /* background: ${({ theme }) => theme.colors.BlackColor}; */
  background: transparent;
  font-size: 8px;
  text-align: right;
  padding: 0 5px;
  font-weight: 700;

  ::placeholder {
    color: var(--color-white-80);
    font-weight: 700;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 25px;
    font-size: 12px;
  }
`

const Label = styled(Text).attrs({
  color: 'var(--color-white-80)',
})`
  font-size: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 12px;
  }
`
