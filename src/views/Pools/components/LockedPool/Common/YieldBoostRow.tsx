import { Flex, Text, TooltipText, useTooltip } from 'packages/uikit'

import { useVaultApy } from 'hooks/useVaultApy'
import { BalanceWithLoading } from 'components/Balance'
import { useTranslation } from 'contexts/Localization'

const YieldBoostRow = ({ secondDuration }) => {
  const { boostFactor } = useVaultApy({ duration: secondDuration })
  const { t } = useTranslation()

  const tooltipContent = t(
    'Your yield will be boosted based on the total lock duration of your current fixed term staking position.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText>
        <Text ref={targetRef} color="textSubtle" fontSize="14px">
          {t('Yield boost')}
        </Text>
      </TooltipText>
      <BalanceWithLoading
        color="text"
        bold
        fontSize="16px"
        value={boostFactor ? boostFactor?.toString() : '0'}
        decimals={2}
        unit="x"
      />
    </Flex>
  )
}

export default YieldBoostRow
