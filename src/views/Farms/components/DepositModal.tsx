import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Flex,
  Text,
  Button,
  Modal,
  LinkExternal,
  CalculateIcon,
  IconButton,
  Skeleton,
  AutoRenewIcon,
  ModalHeader,
} from 'packages/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { UIButton } from 'components/TabiSwap/components/ui'
import { FlexGap } from 'components/Layout/Flex'

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

const StyledModal = styled(Modal)`
  background-color: ${({ theme }) => theme.colors.ModalBg};
`

const StyledButton = styled(UIButton.UIStyledActionButton)`
  background-color: #7f7f7f;
`

const StyledConfirmButton = styled(UIButton.UIStyledActionButton)`
  background: ${({ theme }) => theme.colors.MainColor} !important;
`

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  stakedBalance,
  onConfirm,
  onDismiss,
  tokenName = '',
  multiplier,
  displayApr,
  lpPrice,
  lpLabel = '',
  apr,
  addLiquidityUrl,
  cakePrice,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const lpTokensToStake = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const usdToStake = lpTokensToStake.times(lpPrice)

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !lpTokensToStake.isNaN() ? usdToStake.toNumber() : 0,
    apr,
    earningTokenPrice: cakePrice.toNumber(),
  })

  const annualRoi = cakePrice.times(interestBreakdown[3])
  const annualRoiAsNumber = annualRoi.toNumber()
  const formattedAnnualRoi = formatNumber(annualRoiAsNumber, annualRoi.gt(10000) ? 0 : 2, annualRoi.gt(10000) ? 0 : 2)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        linkLabel={t('Get %symbol%', { symbol: lpLabel })}
        stakingTokenBalance={stakedBalance.plus(max)}
        stakingTokenSymbol={tokenName}
        stakingTokenPrice={lpPrice.toNumber()}
        earningTokenPrice={cakePrice.toNumber()}
        apr={apr}
        multiplier={multiplier}
        displayApr={displayApr}
        linkHref={addLiquidityUrl}
        isFarm
        initialValue={val}
        onBack={() => setShowRoiCalculator(false)}
      />
    )
  }

  return (
    <StyledModal title={t('Stake LP tokens')} onDismiss={onDismiss}>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t('Stake')}
      />
      {/* <Flex mt="24px" alignItems="center" justifyContent="space-between">
        <Text mr="8px" color="textSubtle">
          {t('Annual ROI at current rates')}:
        </Text>
        {Number.isFinite(annualRoiAsNumber) ? (
          <AnnualRoiContainer
            alignItems="center"
            onClick={() => {
              setShowRoiCalculator(true)
            }}
          >
            <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
            <IconButton variant="text" scale="sm">
              <CalculateIcon color="MainColor" width="18px" />
            </IconButton>
          </AnnualRoiContainer>
        ) : (
          <Skeleton width={60} />
        )}
      </Flex> */}
      <FlexGap>
        <StyledButton onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </StyledButton>
        {pendingTx ? (
          <StyledConfirmButton width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
            {t('Confirming')}
          </StyledConfirmButton>
        ) : (
          <StyledConfirmButton
            width="100%"
            disabled={!lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              onDismiss?.()
              setPendingTx(false)
            }}
          >
            {t('Confirm')}
          </StyledConfirmButton>
        )}
      </FlexGap>
      <LinkExternal color="WhiteColor" href={addLiquidityUrl} style={{ alignSelf: 'center', fontWeight: '400' }}>
        {t('Get %symbol%', { symbol: tokenName })}
      </LinkExternal>
    </StyledModal>
  )
}

export default DepositModal
