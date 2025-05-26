/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Text, Box, Flex, Slider, useModal } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import { useWeb3React } from '@web3-react/core'
import { UIButton } from 'components/TabiSwap/components/ui'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Currency } from '@tabi-dex/sdk'
import { utils } from 'ethers'
import { CHAIN_ID } from 'config/constants/networks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PRESALE_ADDRESS, SUGGESTED_BASES } from 'config/constants'
import ImageGroup from './ImageGroup'
import BuyModal from './BuyModal'
import { useCampaignRound } from '../hooks/useCampaign'
import ClaimModal from './ClaimModal'

const INFOS = [
  {
    name: 'Total Token Raise',
    value: '10.500.000 TABI',
  },
  {
    name: 'Price',
    value: '1 TABI = 0.0014 USDC',
  },
  {
    name: 'Listing Price',
    value: '$0.0015',
  },
  {
    name: 'Start Time',
    value: '7AM UTC,23 December 2023',
  },
  {
    name: 'End Time',
    value: '11AM UTC,23 December 2023',
  },
  {
    name: 'Listing Time',
    value: '1PM UTC,23 December 2023',
  },
  {
    name: 'Claiming Time',
    value: '2PM UTC,23 December 2023',
  },
]

const FairlaunchCard = () => {
  const hideBalance = false
  const { data } = useCampaignRound(PRESALE_ADDRESS[CHAIN_ID], 0)

  const [startDateTime, setStartDateTime] = useState(new Date())
  const [endDateTime, setEndDateTime] = useState(new Date())
  const [amount, setAmount] = useState('')
  const tokenSale = SUGGESTED_BASES[CHAIN_ID][1]
  const tokenPrice = Number(utils.formatUnits(data?.priceRate || '0', 12))
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  // const primaryStep = useMemo(() => {
  //   return data ? ((+data.maxTokensToSell - +data.inSale) / +data.maxTokensToSell) * 100 : 0
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data?.maxTokensToSell, data?.inSale])

  const canBuy = useMemo(
    () => Number(amount) < 0.0014 || Date.now() / 1000 < data?.startDate || Date.now() / 1000 > data?.endDate,
    [amount, data?.startDate],
  )
  const canClaim = Date.now() / 1000 < data?.vestingStartTime || data?.vestingStartTime === 0

  const currency = Currency.ETHER
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const buyModal = useCallback(() => <BuyModal amount={amount} tokenPrice={tokenPrice} />, [amount, tokenPrice])
  const claimModal = useCallback(() => <ClaimModal account={account} />, [account])
  const [onPresentClaimModal] = useModal(claimModal, true, true, `claimModal-0`)
  const [onPresentBuyModal] = useModal(buyModal, true, true, `buyModal-0`)

  useEffect(() => {
    if (data?.startDate) setStartDateTime(new Date(data.startDate * 1000))
    if (data?.endDate) setEndDateTime(new Date(data.endDate * 1000))
  }, [data?.endDate, data?.startDate])

  return (
    <StyledFairlaunchCard>
      <Flex width="100%">
        <Text color="MainColor" fontSize="40px" fontWeight="700" margin="auto">
          Fairlaunch
        </Text>
      </Flex>

      <ImageGroup mt="26px" mb="48px" />

      <Flex flexDirection="column" mb="36px">
        <Text color="text" fontWeight="700">
          {t('Presale Infomation')}
        </Text>

        {INFOS.map((info) => (
          <Flex key={info.name} justifyContent="space-between">
            <LightText>{info.name}</LightText>
            <LightText>{info.value}</LightText>
          </Flex>
        ))}
      </Flex>

      <AutoColumn>
        <AutoRow style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <StyledLable>{t('Amount in  USDC')}</StyledLable>

            <StyledCurrentcyInput
              label="Amount"
              value={amount.toString()}
              showMaxButton
              showCurrency={false}
              currency={false}
              disableCurrencySelect
              hideBalance
              onUserInput={(value) => {
                setAmount(value)
              }}
              onMax={() => {
                setAmount(selectedCurrencyBalance?.toSignificant(6) || '0')
              }}
              id="currency-input"
              showCommonBases={false}
              mb="36px"
            />
          </div>

          {account && (
            <StyledBlance color="WhiteColorLight" fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
              {!hideBalance && !!currency
                ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                : ' -'}
            </StyledBlance>
          )}
        </AutoRow>
      </AutoColumn>

      <LightText mt=" 12px" mb="12px">
        Max allocation: 5000 USDC per wallet
      </LightText>

      {!account ? (
        <StyledConnectButton />
      ) : (
        <Flex flexDirection="column">
          <ActionButton width="100%" onClick={onPresentBuyModal} disabled={canBuy}>
            BUY
          </ActionButton>
          <ActionButton width="100%" onClick={onPresentClaimModal} disabled={canClaim} mt="12px">
            CLAIM
          </ActionButton>
        </Flex>
      )}
    </StyledFairlaunchCard>
  )
}

export default FairlaunchCard

const StyledFairlaunchCard = styled(Box)`
  max-width: 529px;
  width: 100%;
  margin: auto;
  padding: 32px;
  background: ${({ theme }) => theme.colors.ModalBg};
  border-radius: 16px;
`

const LightText = styled(Text)`
  color: ${({ theme }) => theme.colors.WhiteColorLight};
`

const StyledConnectButton = styled(ConnectWalletButton)`
  width: 100%;
  min-height: 72px !important;
`

const ActionButton = styled(UIButton.UIStyledActionButton)`
  min-height: 72px !important;
`

const StyledLable = styled(Text)`
  color: #b2b2b2;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  margin-bottom: 5px;
  position: absolute;
  top: 10%;
`

const StyledBlance = styled(Text)`
  position: absolute;
  top: 8px;
  right: 0;
`

const StyledCurrentcyInput = styled(CurrencyInputPanel)``
