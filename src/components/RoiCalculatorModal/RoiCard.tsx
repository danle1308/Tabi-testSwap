import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, Input, CheckmarkIcon, PencilIcon, IconButton } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { CalculatorMode, RoiCalculatorReducerState } from './useRoiCalculatorReducer'

const MILLION = 1000000
const TRILLION = 1000000000000

const RoiCardWrapper = styled(Box)`
  padding: 1px;
  width: 100%;
`

const RoiCardInner = styled(Box)`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.MainColor};
  border-radius: 8px;
`

const StyledText = styled(Text)`
  overflow-wrap: break-word;
`

const RoiInputContainer = styled(Box)`
  position: relative;

  & > input {
    padding: 0 5px 0 16px;
    max-width: 117px;
    background: transparent;
    height: 32px;
    font-size: 14px;
    font-weight: 400;
  }
`

const RoiDisplayContainer = styled(Flex)`
  padding: 0 5px 0 16px;
  margin-right: 8px;

  width: 100%;
  max-width: 117px;
  height: 32px;

  border: 1px solid ${({ theme }) => theme.colors.MainColor};
  border-radius: 8px;

  font-weight: 400;
`

const RoiDollarAmount = styled(Text)<{ fadeOut: boolean }>`
  position: relative;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 0px;
  }

  ${({ fadeOut, theme }) =>
    fadeOut &&
    `
      &:after {
        // background: linear-gradient(
        //   to right,
        //   ${theme.colors.background}00,
        //   ${theme.colors.background}E6
        // );
        content: '';
        height: 100%;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
      }
  `}
`

const RoiInput = styled(Input)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.MainColor};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.WhiteColor};

  &:focus {
    box-shadow: none !important;
  }
`

interface RoiCardProps {
  earningTokenSymbol: string
  calculatorState: RoiCalculatorReducerState
  setTargetRoi: (amount: string) => void
  setCalculatorMode: (mode: CalculatorMode) => void
}

const RoiCard: React.FC<RoiCardProps> = ({ earningTokenSymbol, calculatorState, setTargetRoi, setCalculatorMode }) => {
  const [expectedRoi, setExpectedRoi] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { roiUSD, roiTokens, roiPercentage } = calculatorState.data
  const { mode } = calculatorState.controls
  // console.log(calculatorState.data)

  const { t } = useTranslation()

  useEffect(() => {
    if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mode])

  const onEnterEditing = () => {
    setCalculatorMode(CalculatorMode.PRINCIPAL_BASED_ON_ROI)
    setExpectedRoi(
      roiUSD.toLocaleString('en', {
        minimumFractionDigits: roiUSD > MILLION ? 0 : 2,
        maximumFractionDigits: roiUSD > MILLION ? 0 : 2,
      }),
    )
  }

  const onExitRoiEditing = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }
  const handleExpectedRoiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.validity.valid) {
      const roiAsString = event.target.value.replace(/,/g, '.')
      setTargetRoi(roiAsString)
      setExpectedRoi(roiAsString)
    }
  }
  return (
    <RoiCardWrapper>
      <RoiCardInner>
        <StyledText fontSize="14px" color="WhiteColor" mb="12px">
          {t('ROI at current rates')}
        </StyledText>
        <Flex alignItems="center" height="36px" mb="12px">
          {mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI ? (
            <>
              <RoiInputContainer>
                <RoiInput
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+[.,]?[0-9]*$"
                  scale="sm"
                  value={expectedRoi}
                  placeholder="0.0"
                  onChange={handleExpectedRoiChange}
                />
              </RoiInputContainer>
              <IconButton scale="sm" variant="text" onClick={onExitRoiEditing}>
                <CheckmarkIcon color="primary" />
              </IconButton>
            </>
          ) : (
            <>
              <RoiDisplayContainer onClick={onEnterEditing} alignItems="center">
                {/* Dollar sign is separate cause its not supposed to scroll with a number if number is huge */}
                {/* <Text fontSize="24px" bold>
                  $
                </Text> */}
                <RoiDollarAmount fontSize="14px" fadeOut={roiUSD > TRILLION}>
                  {roiUSD.toLocaleString('en', {
                    minimumFractionDigits: roiUSD > MILLION ? 0 : 2,
                    maximumFractionDigits: roiUSD > MILLION ? 0 : 2,
                  })}
                </RoiDollarAmount>
              </RoiDisplayContainer>
              <IconButton scale="sm" variant="text" onClick={onEnterEditing}>
                <PencilIcon color="MainColor" />
              </IconButton>
            </>
          )}
        </Flex>
        <StyledText fontSize="12px" color="InputNumbericColor">
          ~ {roiTokens} {earningTokenSymbol} (
          {roiPercentage.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %)
        </StyledText>
      </RoiCardInner>
    </RoiCardWrapper>
  )
}

export default RoiCard
