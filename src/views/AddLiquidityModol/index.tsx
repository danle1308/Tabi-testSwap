import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@tabi-dex/sdk'
import {
  Button,
  Text,
  AddIcon,
  CardBody,
  Message,
  useModal,
  Box,
  Flex,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContainer,
  useMatchBreakpoints,
} from 'packages/uikit'
import { logError } from 'utils/sentry'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useTranslation } from 'contexts/Localization'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { CHAIN_ID } from 'config/constants/networks'
import styled from 'styled-components'
// import { BodyWrapper } from 'components/App/AppBody'
import { UIButton } from 'components/TabiSwap/components/ui'
import { AppDispatch } from 'state'
import { useGasPrice, useIsExpertMode, useUserSlippageTolerance } from 'state/user/hooks'
import { useCurrency } from 'hooks/Tokens'
import { Field, resetMintState } from 'state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import currencyId from 'utils/currencyId'
import ConfirmAddLiquidityModal from 'views/Swap/components/ConfirmAddLiquidityModal'
import { AppBody, AppHeader } from 'components/App'
import Page from 'views/Page'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import CurrencyInputPanelPools from 'components/CurrencyInputPanelPools'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Layout/Row'
import PoolPriceBar from 'views/AddLiquidity/PoolPriceBar'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Dots from 'components/Loader/Dots'
import { MinimalPositionCard } from 'components/PositionCard'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { ROUTER_ADDRESS } from 'config/constants'
import { PairState } from 'hooks/usePairs'
import Modals from 'packages/uikit/src/widgets/Modal/Modals'
import ChevronUp from 'packages/uikit/src/components/Svg/Icons/ChevronUp'
import ChevronDown from 'packages/uikit/src/components/Svg/Icons/ChevronDown'

export default function AddLiquidityModol({ currencyIdA, currencyIdB }) {
  const router = useRouter()
  // const [currencyIdA, currencyIdB] = router.query.currency || []
  // const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  // const [currency1, setCurrency1] = useState<Currency | null>(null)
  // console.log('{ currencyIdA,  currencyIdB}', { currencyIdA,  currencyIdB})

  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const gasPrice = useGasPrice()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  const oneCurrencyIsWBNB = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId]))),
  )

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
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
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[CHAIN_ID])
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[CHAIN_ID])

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const routerContract = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsBNB = currencyB === ETHER
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsBNB ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsBNB ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsBNB ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }
    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
            type: 'add-liquidity',
          })
        }),
      )
      .catch((err) => {
        if (err && err.code !== 4001) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage: err && err.code !== 4001 ? `Add Liquidity failed: ${err.message}` : undefined,
          txHash: undefined,
        })
      })
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      // setCurrency0(currencyA_)
      // if (newCurrencyIdA === currencyIdB) {
      //   router.replace(`/add/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
      // } else if (currencyIdB) {
      //   router.replace(`/add/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
      // } else {
      //   router.replace(`/add/${newCurrencyIdA}`, undefined, { shallow: true })
      // }
    },
    [currencyIdB, router, currencyIdA],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      // const newCurrencyIdB = currencyId(currencyB_)
      // if (currencyIdA === newCurrencyIdB) {
      //   if (currencyIdB) {
      //     router.replace(`/add/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
      //   } else {
      //     router.replace(`/add/${newCurrencyIdB}`, undefined, { shallow: true })
      //   }
      // } else {
      //   router.replace(`/add/${currencyIdA || 'ETH'}/${newCurrencyIdB}`, undefined, { shallow: true })
      // }
      // setCurrency1(currencyB_)
    },
    [currencyIdA, router, currencyIdB],
  )

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const [isOpen, setIsOpen] = useState(false)
  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      title={noLiquidity ? t('You are creating a pool') : t('Preview')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
      allowedSlippage={allowedSlippage}
      onAdd={() => onAdd()}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
      textScale="xs"
    />,
    true,
    true,
    'addLiquidityModal',
  )

  return (
    <>
      <div>
        <AutoColumn p="0" gap={isMobile ? '10px' : '20px'}>
          {noLiquidity && (
            <ColumnCenter>
              <Message variant="warning">
                <div>
                  <Text bold mb="8px">
                    {t('You are the first liquidity provider.')}
                  </Text>
                  <Text mb="8px">{t('The ratio of tokens you add will set the price of this pool.')}</Text>
                  <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
                </div>
              </Message>
            </ColumnCenter>
          )}
          <Box>
            <Text
              style={{
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '400',
                lineHeight: '20px',
                color: 'var(--color-white-80)',
              }}
            >
              Select a pair
            </Text>
          </Box>
          <CurrencyInputPanelPools
            value={formattedAmounts[Field.CURRENCY_A]}
            onUserInput={onFieldAInput}
            onMax={() => {
              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
            }}
            onCurrencySelect={handleCurrencyASelect}
            showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
            currency={currencies[Field.CURRENCY_A]}
            // currency={currency0}
            disableCurrencySelect
            id="add-liquidity-input-tokena"
            showCommonBases
          />
          <ColumnCenter style={{ position: 'relative' }}>
            <Flex
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                transform: 'translateY(-50%)',
                border: 'none',
                borderTop: '0.5px solid var(--color-white-50)',
                width: '100%',
                zIndex: 0,
              }}
            />
            <AddIcon
              color="WhiteColor"
              style={{ border: '2px solid #fff', borderRadius: '50px', zIndex: '1', background: 'black' }}
              width={isMobile ? '18px' : '30px'}
            />
          </ColumnCenter>
          <CurrencyInputPanelPools
            value={formattedAmounts[Field.CURRENCY_B]}
            onUserInput={onFieldBInput}
            onCurrencySelect={handleCurrencyBSelect}
            onMax={() => {
              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
            }}
            showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
            currency={currencies[Field.CURRENCY_B]}
            disableCurrencySelect
            // currency={currency1}
            id="add-liquidity-input-tokenb"
            showCommonBases
          />
          {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
            <>
              <LightCard style={{ background: 'none' }} mt="1.5rem" mb="0.5rem" padding="0px">
                <RowBetween mb="8px">
                  <Text fontWeight="400" color="var(--color-white-80)" fontSize={isMobile ? '12px' : '14px'}>
                    {noLiquidity ? t('Initial prices and pool share') : t('Pool Details')}
                  </Text>
                </RowBetween>{' '}
                <LightCard style={{ background: 'none', padding: '0' }}>
                  <PoolPriceBar
                    currencies={currencies}
                    poolTokenPercentage={poolTokenPercentage}
                    noLiquidity={noLiquidity}
                    price={price}
                  />
                </LightCard>
              </LightCard>
            </>
          )}

          {addIsUnsupported ? (
            <Button disabled mb="4px">
              {t('Unsupported Asset')}
            </Button>
          ) : !account ? (
            <ConnectWalletButton />
          ) : (
            <AutoColumn gap="md">
              {(approvalA === ApprovalState.NOT_APPROVED ||
                approvalA === ApprovalState.PENDING ||
                approvalB === ApprovalState.NOT_APPROVED ||
                approvalB === ApprovalState.PENDING) &&
                isValid && (
                  <RowBetween>
                    {approvalA !== ApprovalState.APPROVED && (
                      <Button
                        height={isMobile ? '38px' : '48px'}
                        style={{ fontSize: isMobile ? '12px' : '19px', fontWeight: '400', fontFamily: 'Modak' }}
                        onClick={approveACallback}
                        disabled={approvalA === ApprovalState.PENDING}
                        width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                      >
                        {approvalA === ApprovalState.PENDING ? (
                          <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                        ) : (
                          t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                        )}
                      </Button>
                    )}
                    {approvalB !== ApprovalState.APPROVED && (
                      <Button
                        height={isMobile ? '38px' : '48px'}
                        style={{ fontSize: isMobile ? '12px' : '19px', fontWeight: '400', fontFamily: 'Modak' }}
                        onClick={approveBCallback}
                        disabled={approvalB === ApprovalState.PENDING}
                        width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                      >
                        {approvalB === ApprovalState.PENDING ? (
                          <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                        ) : (
                          t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                        )}
                      </Button>
                    )}
                  </RowBetween>
                )}
              <Button
                // variant={
                //   !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                //     ? 'danger'
                //     : 'primary'
                // }
                onClick={() => {
                  if (expertMode) {
                    onAdd()
                  } else {
                    setLiquidityState({
                      attemptingTxn: false,
                      liquidityErrorMessage: undefined,
                      txHash: undefined,
                    })
                    onPresentAddLiquidityModal()
                  }
                }}
                disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                style={{ fontSize: isMobile ? '12px' : '19px', fontWeight: '400', fontFamily: 'Modak' }}
                height={isMobile ? '38px' : '48px'}
              >
                {error ?? t('Add Liquidity')}
              </Button>
            </AutoColumn>
          )}
          <Box
            mt="0.5rem"
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Text color="var(--color-white-80)" fontWeight="400" fontSize={isMobile ? '12px' : '14px'}>
              {t('Your Position')}
            </Text>
            {isOpen ? <ChevronUp width={20} /> : <ChevronDown width={20} />}
          </Box>
        </AutoColumn>
      </div>
      {isOpen && (
        <AutoColumn
          style={{ minWidth: isMobile ? '0' : '20rem', width: '100%', maxWidth: '482px', marginTop: '0.5rem' }}
        >
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
        </AutoColumn>
      )}
      {/* {!addIsUnsupported ? (
        pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '482px', marginTop: '0.5rem' }}>
            <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
          </AutoColumn>
        ) : null
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
      )} */}
    </>
  )
}

const StyledAppBody = styled(AppBody)``
