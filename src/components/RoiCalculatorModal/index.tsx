import { useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Button,
  Flex,
  ButtonMenu,
  Checkbox,
  BalanceInput,
  HelpIcon,
  ButtonMenuItem,
  useTooltip,
  ModalHeader,
} from 'packages/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { UIButton } from 'components/TabiSwap/components/ui'
import RoiCalculatorFooter from './RoiCalculatorFooter'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, {
  CalculatorMode,
  DefaultCompoundStrategy,
  EditingCurrency,
} from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'

export interface RoiCalculatorModalProps {
  onDismiss?: () => void
  onBack?: () => void
  earningTokenPrice: number
  apr?: number
  apy?: number
  displayApr?: string
  linkLabel: string
  linkHref: string
  stakingTokenBalance: BigNumber
  stakingTokenSymbol: string
  stakingTokenPrice: number
  earningTokenSymbol?: string
  multiplier?: string
  autoCompoundFrequency?: number
  performanceFee?: number
  isFarm?: boolean
  initialState?: any
  initialValue?: string
  strategy?: any
  header?: React.ReactNode
}

const StyledModal = styled(Modal)`
  max-width: 385px;
  height: auto;
  max-height: 95vh;

  & > :nth-child(2) {
    padding: 0;
  }
`

const StyledText = styled(Text)``

const StyledBalanceInput = styled(BalanceInput)`
  border-radius: 0;
  background: ${({ theme }) => theme.colors.dropdownDeep};
  border-color: transparent;
`

const StyledButtonBalance = styled(UIButton.UIStyledActionButton)`
  font-size: 12px;
  min-height: fit-content;
  max-height: 22px;
`

const ScrollableContainer = styled.div`
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const TabButtonMenuItem = styled(ButtonMenuItem)`
  border-radius: 8px;
  background-color: ${({ theme, isActive }) => (isActive ? `${theme.colors.MainColor}` : `${theme.colors.WhiteColor}`)};
  color: ${({ theme }) => theme.colors.BlackColor};
  font-weight: 700 !important;

  :hover {
    color: ${({ theme }) => theme.colors.WhiteColor};
  }
`

const CompoundingCheckbox = styled(Checkbox)`
  border-radius: 4px;

  &:hover:not(:disabled):not(:checked) {
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.MainColor};

    &:after {
      border-color: ${({ theme }) => theme.colors.BlackColor};
    }
  }
`

const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  onDismiss,
  onBack,
  earningTokenPrice,
  apr,
  apy,
  displayApr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  multiplier,
  initialValue,
  earningTokenSymbol = '',
  autoCompoundFrequency = 0,
  performanceFee = 0,
  isFarm = false,
  initialState,
  strategy,
  header,
  children,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const balanceInputRef = useRef<HTMLInputElement | null>(null)

  const {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleCompounding,
    toggleEditingCurrency,
    setCompoundingFrequency,
    setCalculatorMode,
    setTargetRoi,
    dispatch,
  } = useRoiCalculatorReducer({ stakingTokenPrice, earningTokenPrice, autoCompoundFrequency }, initialState)

  const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus()
    }
  }, [])

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue)
    }
  }, [initialValue, setPrincipalFromTokenValue])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    isFarm
      ? t('“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.')
      : t(
          '“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.',
          { assetSymbol: stakingTokenSymbol },
        ),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const DURATION = useMemo(() => [t('1D'), t('7D'), t('30D'), t('1Y'), t('5Y')], [t])

  return (
    <StyledModal
      title={t('ROI Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="gradients.cardHeader"
    >
      <ScrollableContainer>
        {strategy ? (
          strategy(state, dispatch)
        ) : (
          <DefaultCompoundStrategy
            apr={apy ?? apr}
            dispatch={dispatch}
            state={state}
            earningTokenPrice={earningTokenPrice}
            performanceFee={performanceFee}
            stakingTokenPrice={stakingTokenPrice}
          />
        )}
        {header}
        <Flex flexDirection="column" mb="8px">
          <StyledText fontSize="14px">{t('%asset% staked', { asset: stakingTokenSymbol })}</StyledText>
          <StyledBalanceInput
            inputProps={{
              scale: 'sm',
            }}
            currencyValue={`${conversionValue} ${conversionUnit}`}
            innerRef={balanceInputRef}
            placeholder="0.00"
            value={editingValue}
            unit={editingUnit}
            onUserInput={onUserInput}
            switchEditingUnits={toggleEditingCurrency}
            onFocus={onBalanceFocus}
          />
          <Flex justifyContent="space-between" alignItems="center" mt="8px" mb="24px">
            <StyledButtonBalance width="68px" variant="subtle" onClick={() => setPrincipalFromUSDValue('100')}>
              $100
            </StyledButtonBalance>
            <StyledButtonBalance width="68px" variant="subtle" onClick={() => setPrincipalFromUSDValue('1000')}>
              $1000
            </StyledButtonBalance>
            <StyledButtonBalance
              disabled={
                !Number.isFinite(stakingTokenPrice) ||
                !stakingTokenBalance.isFinite() ||
                stakingTokenBalance.lte(0) ||
                !account
              }
              width="128px"
              variant="tertiary"
              onClick={() =>
                setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString())
              }
            >
              {t('My Balance').toLocaleUpperCase()}
            </StyledButtonBalance>
            <span ref={targetRef} style={{ display: 'flex' }}>
              <HelpIcon width="16px" height="16px" color="WhiteColor" />
            </span>
            {tooltipVisible && tooltip}
          </Flex>
          {children || (
            <>
              <Text color="WhiteColorLight" fontSize="14px">
                {t('Staked for')}
              </Text>
              <FullWidthButtonMenu mb="24px" activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
                {DURATION.map((duration) => (
                  <TabButtonMenuItem key={duration} variant="custome">
                    {duration}
                  </TabButtonMenuItem>
                ))}
              </FullWidthButtonMenu>
            </>
          )}
          {autoCompoundFrequency === 0 && (
            <>
              <Text color="WhiteColorLight" fontSize="14px">
                {t('Compounding every')}
              </Text>
              <Flex alignItems="center" mb="24px">
                <Flex flex="1">
                  <CompoundingCheckbox
                    scale="sm"
                    checked={compounding}
                    onChange={toggleCompounding}
                    style={{ borderRadius: '4px' }}
                  />
                </Flex>
                <Flex flex="6">
                  <FullWidthButtonMenu
                    disabled={!compounding}
                    activeIndex={activeCompoundingIndex}
                    onItemClick={setCompoundingFrequency}
                    scale="sm"
                  >
                    <TabButtonMenuItem>{t('1D')}</TabButtonMenuItem>
                    <TabButtonMenuItem>{t('7D')}</TabButtonMenuItem>
                    <TabButtonMenuItem>{t('14D')}</TabButtonMenuItem>
                    <TabButtonMenuItem>{t('30D')}</TabButtonMenuItem>
                  </FullWidthButtonMenu>
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
        {/* <AnimatedArrow calculatorState={state} /> */}
        <Flex>
          <RoiCard
            earningTokenSymbol={earningTokenSymbol}
            calculatorState={state}
            setTargetRoi={setTargetRoi}
            setCalculatorMode={setCalculatorMode}
          />
        </Flex>
      </ScrollableContainer>
      <RoiCalculatorFooter
        isFarm={isFarm}
        apr={apr}
        apy={apy}
        displayApr={displayApr}
        autoCompoundFrequency={autoCompoundFrequency}
        multiplier={multiplier}
        linkLabel={linkLabel}
        linkHref={linkHref}
        performanceFee={performanceFee}
      />
    </StyledModal>
  )
}

export default RoiCalculatorModal
