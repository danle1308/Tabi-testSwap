import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { useRouter } from 'next/router'
import useToast from 'hooks/useToast'
import { Currency, currencyEquals, ETHER, Percent, WETH } from '@tabi-dex/sdk'
import {
  Button,
  Text,
  AddIcon,
  ArrowDownIcon,
  CardBody,
  Slider,
  Box,
  Flex,
  useModal,
  Modal,
  useMatchBreakpoints,
} from 'packages/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'config/constants/networks'
import { BodyWrapper } from 'components/App/AppBody'
import { UIButton } from 'components/TabiSwap/components/ui'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import { useCurrency } from 'hooks/Tokens'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useGasPrice, useUserSlippageTolerance } from 'state/user/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/burn/hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { Field } from 'state/burn/actions'
import { usePairContract } from 'hooks/useContract'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { ROUTER_ADDRESS } from 'config/constants'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import CurrencyInputPanelPools from 'components/CurrencyInputPanelPools'
import currencyId from 'utils/currencyId'
import { logError } from 'utils/sentry'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import Page from 'views/Page'
import { AppHeader } from 'components/App'
import { LightCard } from 'components/Card'
import { CurrencyLogo } from 'components/Logo'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { MinimalPositionCard } from 'components/PositionCard'
import CurrencyInputPanel from 'components/CurrencyInputPanelWithdraw'
import { RowBetween } from 'components/Layout/Row'
import Dots from 'components/Loader/Dots'
import IconDrop from 'packages/uikit/src/components/Svg/Icons/IconDrop'
import ChevronUp from 'packages/uikit/src/components/Svg/Icons/ChevronUp'
import ChevronDown from 'packages/uikit/src/components/Svg/Icons/ChevronDown'
import ConfirmLiquidityModal from '../Swap/components/ConfirmRemoveLiquidityModal'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.MainColor};
  border-radius: 8px;
  background: rgba(50, 52, 54, 0.66);
  padding: 16px;
`

const StyledBody = styled(BodyWrapper)`
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 442px;
    min-width: 389px;
  }
`

const StyledButton = styled(UIButton.UIStyledActionButton)`
  height: 50px !important;
  border-radius: 30px;
`

const PercentButton = styled(UIButton.UIStyledActionButton)`
  min-height: 22px;
`

const PercentWrapper = styled.div`
  position: relative;
  padding-top: 16px;
`

const PercentText = styled(Text)`
  font-size: 12px;
  position: absolute;
  top: -15px;
  right: 0;
  transform: translateY(-50%);
`

const InfoWrapper = styled(AutoColumn)`
  /* display: flex;
border-radius: 5px;
border: 0.5px solid var(--color-white-50);
padding: 10px;
justify-content: space-between;
align-items: center; */
`

const CurrencyInputPanelMb = styled(CurrencyInputPanel)`
  margin-bottom: 28px;
`

export default function RemoveLiquidityModol({ currencyIdA, currencyIdB }) {
  const { isMobile } = useMatchBreakpoints()
  const router = useRouter()
  // const [currencyIdA, currencyIdB] = router.query.currency || []
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  console.log('{ currencyIdA,  currencyIdB}', { currencyIdA, currencyIdB })

  const { account, chainId, library } = useActiveWeb3React()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId],
  )

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showDetailed, setShowDetailed] = useState<boolean>(true)
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS[CHAIN_ID])

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'TBS LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[CHAIN_ID],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        })
      })
      .catch((err) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (err?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const onLiquidityInput = useCallback((value: string): void => onUserInput(Field.LIQUIDITY, value), [onUserInput])
  const onCurrencyAInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_A, value), [onUserInput])
  const onCurrencyBInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_B, value), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      toastError(t('Error'), t('Missing currency amounts'))
      throw new Error('missing currency amounts')
    }
    const routerContract = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) {
      toastError(t('Error'), t('Missing tokens'))
      throw new Error('missing tokens')
    }
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    const currencyBIsBNB = currencyB === ETHER
    const oneCurrencyIsBNB = currencyA === ETHER || currencyBIsBNB

    if (!tokenA || !tokenB) {
      toastError(t('Error'), t('Could not wrap'))
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsBNB) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsBNB ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsBNB) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsBNB ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      toastError(t('Error'), t('Attempting to confirm without approval or a signature'))
      throw new Error('Attempting to confirm without approval or a signature')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          }),
      ),
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      toastError(t('Error'), t('This transaction would fail'))
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
        gasPrice,
      })
        .then((response: TransactionResponse) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
            type: 'remove-liquidity',
          })
        })
        .catch((err) => {
          if (err && err.code !== 4001) {
            logError(err)
            console.error(`Remove Liquidity failed`, err, args)
          }
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage: err && err?.code !== 4001 ? `Remove Liquidity failed: ${err.message}` : undefined,
            txHash: undefined,
          })
        })
    }
  }

  const pendingText = t('Removing %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencyA?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencyB?.symbol ?? '',
  })

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsBNB = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWBNB = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB))),
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      // if (currencyIdB && currencyId(currency) === currencyIdB) {
      //   router.replace(`/remove/${currencyId(currency)}/${currencyIdA}`, undefined, { shallow: true })
      // } else {
      //   router.replace(`/remove/${currencyId(currency)}/${currencyIdB}`, undefined, { shallow: true })
      // }
    },
    [currencyIdA, currencyIdB, router],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      // if (currencyIdA && currencyId(currency) === currencyIdA) {
      //   router.replace(`/remove/${currencyIdB}/${currencyId(currency)}`, undefined, { shallow: true })
      // } else {
      //   router.replace(`/remove/${currencyIdA}/${currencyId(currency)}`, undefined, { shallow: true })
      // }
    },
    [currencyIdA, currencyIdB, router],
  )

  const handleDismissConfirmation = useCallback(() => {
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  const [reversed, setReversed] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [onPresentRemoveLiquidity] = useModal(
    <ConfirmLiquidityModal
      title={t('Preview')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash || ''}
      allowedSlippage={allowedSlippage}
      onRemove={() => onRemove()}
      pendingText={pendingText}
      approval={approval}
      signatureData={signatureData}
      tokenA={tokenA}
      tokenB={tokenB}
      liquidityErrorMessage={liquidityErrorMessage}
      parsedAmounts={parsedAmounts}
      currencyA={currencyA}
      currencyB={currencyB}
      textScale="xs"
    />,
    true,
    true,
    'removeLiquidityModal',
  )
  const handleToggle = () => {
    setReversed(!reversed)
  }

  const getPriceDisplay = () => {
    if (reversed) {
      const price = tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'
      return `1 ${currencyB?.symbol} = ${price} ${currencyA?.symbol}`
    }
    const price = tokenA ? pair.priceOf(tokenA).toFixed(2) : '-'
    return `1 ${currencyA?.symbol} = ${price} ${currencyB?.symbol}`
  }

  return (
    <>
      <CardBody p={['0']}>
        <InfoWrapper gap={isMobile ? '10px' : '20px'}>
          {/* <RowBetween>
              <Text>{t('Amount')}</Text>
              <Button variant="text" scale="sm" onClick={() => setShowDetailed(!showDetailed)}>
                {showDetailed ? t('Simple') : t('Detailed')}
              </Button>
            </RowBetween> */}
          {!showDetailed && (
            <BorderCard>
              <Slider
                name="lp-amount"
                min={0}
                max={100}
                value={innerLiquidityPercentage}
                onValueChanged={(value) => setInnerLiquidityPercentage(Math.ceil(value))}
                mb="16px"
              />
              <PercentWrapper>
                <Flex flexWrap="wrap" justifyContent="space-between">
                  <PercentText fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </PercentText>
                  <PercentButton
                    variant="tertiary"
                    scale="sm"
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
                  >
                    25%
                  </PercentButton>
                  <PercentButton
                    variant="tertiary"
                    scale="sm"
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
                  >
                    50%
                  </PercentButton>
                  <PercentButton
                    variant="tertiary"
                    scale="sm"
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}
                  >
                    75%
                  </PercentButton>
                  <PercentButton
                    variant="tertiary"
                    scale="sm"
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  >
                    {t('Max')}
                  </PercentButton>
                </Flex>
              </PercentWrapper>
            </BorderCard>
          )}
        </InfoWrapper>
        {!showDetailed && (
          <>
            {/* <ColumnCenter>
                <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
              </ColumnCenter> */}
            <InfoWrapper gap="10px">
              <Text color="WhiteColor" fontSize="14px">
                {t('You will receive')}
              </Text>
              <LightCard>
                <Flex justifyContent="space-between" mb="8px">
                  <Flex>
                    <CurrencyLogo currency={currencyA} />
                    <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                      {currencyA?.symbol}
                    </Text>
                  </Flex>
                  <Text small>{formattedAmounts[Field.CURRENCY_A] || '-'}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Flex>
                    <CurrencyLogo currency={currencyB} />
                    <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                      {currencyB?.symbol}
                    </Text>
                  </Flex>
                  <Text small>{formattedAmounts[Field.CURRENCY_B] || '-'}</Text>
                </Flex>
                {/* {chainId && (oneCurrencyIsWBNB || oneCurrencyIsBNB) ? (
                      <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                        {oneCurrencyIsBNB ? (
                          <StyledInternalLink
                            href={`/remove/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${
                              currencyB === ETHER ? WETH[chainId].address : currencyIdB
                            }`}
                          >
                            {t('Receive WETH')}
                          </StyledInternalLink>
                        ) : oneCurrencyIsWBNB ? (
                          <StyledInternalLink
                            href={`/remove/${
                              currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA
                            }/${currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB}`}
                          >
                            {t('Receive ETH')}
                          </StyledInternalLink>
                        ) : null}
                      </RowBetween>
                    ) : null} */}
              </LightCard>
            </InfoWrapper>
          </>
        )}

        {showDetailed && (
          <Box mb="16px">
            <Box mb="12px">
              <CurrencyInputPanelPools
                value={formattedAmounts[Field.LIQUIDITY]}
                onUserInput={onLiquidityInput}
                onMax={() => {
                  onUserInput(Field.LIQUIDITY_PERCENT, '100')
                }}
                showMaxButton={!atMaxAmount}
                disableCurrencySelect
                currency={pair?.liquidityToken}
                pair={pair}
                id="liquidity-amount"
                onCurrencySelect={() => null}
                // isQuickButton
              />
            </Box>
            <Box my="2rem">
              <Box style={{ width: '100%', height: '0.5px', background: 'var(--color-white-50)' }} />
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <CurrencyInputPanel
                hideBalance
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onCurrencyAInput}
                onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                showMaxButton={!atMaxAmount}
                currency={currencyA}
                label={t('Output')}
                disableCurrencySelect
                onCurrencySelect={handleSelectCurrencyA}
                id="remove-liquidity-tokena"
                isQuickButton
              />
              <ColumnCenter>
                <AddIcon
                  width={isMobile ? '18px' : '20px'}
                  style={{
                    border: '2px solid #fff',
                    borderRadius: '50px',
                    zIndex: '1',
                    background: 'black',
                    color: 'white',
                  }}
                />
              </ColumnCenter>
              <Flex />
              <CurrencyInputPanel
                hideBalance
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onCurrencyBInput}
                onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                showMaxButton={!atMaxAmount}
                currency={currencyB}
                label={t('Output')}
                disableCurrencySelect
                onCurrencySelect={handleSelectCurrencyB}
                id="remove-liquidity-tokenb"
                isQuickButton
                align="right"
                justifyContent="flex-end"
              />
            </Box>
          </Box>
        )}
        {pair && (
          <InfoWrapper
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '0.5px solid var(--color-white-50)',
              borderRadius: '5px',
              padding: '10px',
              minHeight: '49px',
              height: '100%',
              marginTop: '1.5rem',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: isMobile ? '10px' : '14px',
                fontWeight: '400',
                color: 'var(--color-white-80)',
              }}
            >
              {t('Prices')}
            </Text>
            <Flex alignItems="center" gap="6px">
              <IconDrop onClick={handleToggle} width={isMobile ? '12px' : '16px'} height="12px" />
              <Text fontSize={isMobile ? '10px' : '14px'} fontWeight="700">
                {getPriceDisplay()}
              </Text>
            </Flex>
          </InfoWrapper>
        )}
        <Box position="relative" mt="1.5rem">
          {!account ? (
            <ConnectWalletButton width="100%" />
          ) : (
            <RowBetween>
              <Button
                height={isMobile ? '38px' : '48px'}
                style={{
                  fontSize: isMobile ? '12px' : '19px',
                  fontWeight: '400',
                  fontFamily: 'Modak',
                  color: 'white',
                  borderRadius: '30px',
                  lineHeight: '20px',
                }}
                onClick={() => onAttemptToApprove()}
                variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
                disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                width="100%"
                mr="0.5rem"
              >
                {approval === ApprovalState.PENDING ? (
                  <Dots>{t('Enabling')}</Dots>
                ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                  t('Enabled')
                ) : (
                  t('Enable')
                )}
              </Button>
              <Button
                height={isMobile ? '38px' : '48px'}
                style={{
                  fontSize: isMobile ? '12px' : '19px',
                  fontWeight: '400',
                  fontFamily: 'Modak',
                  color: 'white',
                  lineHeight: '20px',
                }}
                variant={
                  !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                    ? 'danger'
                    : 'primary'
                }
                onClick={() => {
                  setLiquidityState({
                    attemptingTxn: false,
                    liquidityErrorMessage: undefined,
                    txHash: undefined,
                  })
                  onPresentRemoveLiquidity()
                }}
                width="100%"
                disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
              >
                {error || t('Withdraw')}
              </Button>
            </RowBetween>
          )}
        </Box>
        <Box
          style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1.5rem' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Text color="var(--color-white-80)" fontWeight="400" fontSize={isMobile ? '12px' : '14px'}>
            {t('Your Position')}
          </Text>
          {isOpen ? <ChevronUp width={20} /> : <ChevronDown width={20} />}
        </Box>
      </CardBody>
      {isOpen && (
        <AutoColumn
          style={{ minWidth: isMobile ? 'auto' : '20rem', width: '100%', maxWidth: '482px', marginTop: '0.5rem' }}
        >
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
        </AutoColumn>
      )}
      {/* {pair ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '442px', marginTop: '0.5rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
        </AutoColumn>
      ) : null} */}
    </>
  )
}
