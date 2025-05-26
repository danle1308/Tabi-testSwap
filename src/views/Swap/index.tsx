import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade } from '@tabi-dex/sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  IconButton,
  BottomDrawer,
  useMatchBreakpoints,
  ArrowUpDownIcon,
  Skeleton,
} from 'packages/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import Footer from 'components/Menu/Footer'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'
import { BodyWrapper } from 'components/App/AppBody'
import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber'
import AddressInputPanel from './components/AddressInputPanel'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ProgressSteps from './components/ProgressSteps'
// import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  useSingleTokenSwapInfo,
} from '../../state/swap/hooks'
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useExchangeChartManager,
} from '../../state/user/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'

const Label = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.WhiteColor};
`

const RestyledButton = styled(Button)`
  font-family: 'Modak';
  height: 30px;
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 19px;
    height: 48px;
    box-shadow: 1px solid #ffffff;
  }
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: none;
  border-radius: 50%;
  background: transparent;
  border: 1px solid #ffffff;

  aspect-ratio: 1/1;
  height: 16.17px;
  width: 16.17px;

  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: transparent;
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      /* border-radius: 50%;
      border: 3px solid #ffffff; */
      display: block;
      fill: #ffffff;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 30px;
    width: 30px;
    border: 3px solid #ffffff;
  }
`

const PositionTest = styled(Page)``

const StyledAppBody = styled(BodyWrapper)`
  max-width: 100%;
  margin: auto;
`

export default function Swap() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const maxAmountOutput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.OUTPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const [isDisabled, setIsDisabled] = useState(false)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })

    setIsDisabled(true)

    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
        setIsDisabled(false)
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
        setIsDisabled(false)
      })
      .finally(() => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: undefined,
          txHash: undefined,
        })
        setIsDisabled(false)
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleMaxOutput = useCallback(() => {
    if (maxAmountOutput) {
      onUserInput(Field.OUTPUT, maxAmountOutput.toExact())
    }
  }, [maxAmountOutput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  console.log('isDisabled', isDisabled)

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      isDisabled={isDisabled}
      setIsDisabled={setIsDisabled}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  return (
    <PositionTest
      style={{
        background: 'transparent',
      }}
      removePadding={isChartExpanded}
      hideFooterOnDesktop={isChartExpanded}
    >
      <Flex width="100%" justifyContent="center" position="relative">
        {/* {!isMobile && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )} */}
        <BottomDrawer
          content={
            <PriceChartContainer
              inputCurrencyId={inputCurrencyId}
              inputCurrency={currencies[Field.INPUT]}
              outputCurrencyId={outputCurrencyId}
              outputCurrency={currencies[Field.OUTPUT]}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              isChartDisplayed={isChartDisplayed}
              currentSwapPrice={singleTokenPrice}
              isMobile
            />
          }
          isOpen={isChartDisplayed}
          setIsOpen={setIsChartDisplayed}
        />
        <Flex flexDirection="column" width="100%">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper
              maxWidth={isMobile ? '240px' : '485px'}
              mx="auto"
              mt={isChartExpanded ? '24px' : '0'}
            >
              <StyledAppBody>
                <CurrencyInputHeader
                  title={t('Swap')}
                  subtitle={t('')}
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                  hasAmount={hasAmount}
                  onRefreshPrice={onRefreshPrice}
                  topIconSetting={isMobile ? '-10px' : '-15px'}
                  rightIconSetting={isMobile ? '-20px' : '-10px'}
                />
                <Wrapper
                  id="swap-page"
                  style={{
                    minHeight: ['290px', , '330px', , '412px'],
                    // minHeight: isMobile ? '290px' : '412px',
                    padding: isMobile ? '0 1rem 1rem 1rem' : ' 0 1.5rem 1.5rem 1.5rem',
                  }}
                >
                  <AutoColumn gap="sm" style={{ marginBottom: isMobile ? '0px' : '5px' }}>
                    <CurrencyInputPanel
                      label={
                        independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                      }
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                      isQuickButton
                      showCommonBases
                    />

                    <AutoColumn justify="space-between">
                      <AutoRow
                        justify={isExpertMode ? 'space-between' : 'center'}
                        style={{ padding: isMobile ? '0px 5px' : '0rem 0.5rem', marginBottom: '0' }}
                      >
                        <SwitchIconButton
                          scale="sm"
                          onClick={() => {
                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                            onSwitchTokens()
                          }}
                        >
                          <ArrowDownIcon
                            width={isMobile ? '10px' : '20px'}
                            className="icon-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? '#ffffff' : '#ffffff'}
                            style={{ background: 'transparent ' }}
                          />
                          <ArrowUpDownIcon
                            width={isMobile ? '10px' : '20px'}
                            className="icon-up-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? '#ffffff' : '#ffffff'}
                          />
                        </SwitchIconButton>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <Button
                            style={{
                              color: 'rgba(230, 240, 16, 1)',
                              height: isMobile ? '20px' : '48px',
                              fontSize: isMobile ? '10px' : '16px',
                              padding: isMobile ? '0px 5px' : '12px 20px',
                            }}
                            variant="text"
                            id="add-recipient-button"
                            onClick={() => onChangeRecipient('')}
                          >
                            {t('+ Add a send (optional)')}
                          </Button>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onMax={handleMaxOutput}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                      isQuickButton
                      style={{
                        marginTop: isMobile ? '5px' : '15px',
                      }}
                    />

                    {isExpertMode && recipient !== null && !showWrap ? (
                      <>
                        <AutoRow
                          justify="space-between"
                          style={{
                            padding: isMobile ? '0px 5px' : '0rem 0.5rem',
                            marginBottom: isMobile ? '0' : '10px',
                          }}
                        >
                          <ArrowWrapper clickable={false} style={{ padding: 0 }}>
                            <ArrowDownIcon width={isMobile ? '16px' : '30px'} height="30px" />
                          </ArrowWrapper>
                          <Button
                            style={{
                              color: 'rgba(230, 240, 16, 1)',
                              height: isMobile ? '20px' : '48px',
                              fontSize: isMobile ? '10px' : '16px',
                              padding: isMobile ? '0px 5px' : '12px 20px',
                            }}
                            variant="text"
                            id="remove-recipient-button"
                            onClick={() => onChangeRecipient(null)}
                          >
                            {t('- Remove send')}
                          </Button>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}

                    {showWrap ? null : (
                      <AutoColumn gap="15px" style={{ padding: isMobile ? '0 0 0 5px' : '0' }}>
                        <RowBetween align="center">
                          {Boolean(trade) && (
                            <>
                              {isLoading ? (
                                <Skeleton width="100%" ml="8px" height="24px" />
                              ) : (
                                <TradePrice
                                  price={trade?.executionPrice}
                                  showInverted={showInverted}
                                  setShowInverted={setShowInverted}
                                />
                              )}
                            </>
                          )}
                        </RowBetween>
                      </AutoColumn>
                    )}
                  </AutoColumn>
                  <Box mt="0.25rem">
                    {swapIsUnsupported ? (
                      <RestyledButton scale={isMobile ? 'xs' : 'md'} width="100%" disabled>
                        {t('Unsupported Asset')}
                      </RestyledButton>
                    ) : !account ? (
                      <ConnectWalletButton
                        variant="primary"
                        width="100%"
                        scale={isMobile ? 'xs' : 'md'}
                        style={{
                          height: isMobile ? '30px' : '50px',
                          fontFamily: 'Modak',
                          fontSize: isMobile ? '12px' : '19px',
                          borderRadius: '30px',
                          boxShadow: '0px 3px 0px 0px #FFFFFF',
                        }}
                      />
                    ) : showWrap ? (
                      <RestyledButton
                        scale={isMobile ? 'xs' : 'md'}
                        width="100%"
                        disabled={Boolean(wrapInputError)}
                        onClick={onWrap}
                      >
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </RestyledButton>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <RestyledButton
                        scale={isMobile ? 'xs' : 'md'}
                        width="100%"
                        style={{ textAlign: 'center', padding: '0.75rem' }}
                      >
                        <Text fontSize={isMobile ? '10px' : '19px'} color="white" fontFamily="Modak">
                          {t('Insufficient liquidity for this trade')}
                        </Text>
                        {singleHopOnly && (
                          <Text fontSize={isMobile ? '10px' : '19px'} color="textSubtle">
                            {t('Try enabling multi-hop trades')}
                          </Text>
                        )}
                      </RestyledButton>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <RestyledButton
                          scale={isMobile ? 'xs' : 'md'}
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </RestyledButton>
                        <RestyledButton
                          // variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          }}
                          scale={isMobile ? 'xs' : 'md'}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact High')
                            : priceImpactSeverity > 2
                            ? t('Swap Anyway')
                            : t('Swap')}
                        </RestyledButton>
                      </RowBetween>
                    ) : (
                      <RestyledButton
                        // variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            onPresentConfirmModal()
                          }
                        }}
                        id="swap-button"
                        // style={{ color: '#000000' }}
                        width="100%"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                        scale={isMobile ? 'xs' : 'md'}
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact Too High')
                            : priceImpactSeverity > 2
                            ? 'Swap Anyway'
                            : 'Swap')}
                      </RestyledButton>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  </Box>

                  {!swapIsUnsupported ? (
                    trade && <AdvancedSwapDetailsDropdown trade={trade} />
                  ) : (
                    <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
                  )}
                </Wrapper>
              </StyledAppBody>

              {/* {!swapIsUnsupported ? (
                trade && <AdvancedSwapDetailsDropdown trade={trade} />
              ) : (
                <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
              )} */}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {isChartExpanded && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
            </Box>
          )}
        </Flex>
      </Flex>
    </PositionTest>
  )
}
