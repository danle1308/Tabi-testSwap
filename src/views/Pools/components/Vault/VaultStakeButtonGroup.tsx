import { Box, TooltipText, useTooltip } from 'packages/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'
import { UIButton } from 'components/TabiSwap/components/ui'

export const VaultStakeButtonGroup = ({
  onFlexibleClick,
  onLockedClick,
}: {
  onFlexibleClick: () => void
  onLockedClick: () => void
}) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      {t(
        'Flexible staking offers flexibility for staking/unstaking whenever you want. Locked staking offers higher APY as well as other benefits.',
      )}
    </Box>,
    {},
  )
  return (
    <Box width="100%">
      <FlexGap gap="12px">
        <UIButton.UIStyledButton style={{ flex: 1 }} onClick={onFlexibleClick}>
          {t('Flexible')}
        </UIButton.UIStyledButton>
        <UIButton.UIStyledButton style={{ flex: 1 }} onClick={onLockedClick}>
          {t('Locked')}
        </UIButton.UIStyledButton>
      </FlexGap>
      {tooltipVisible && tooltip}
      <TooltipText mt="16px" small ref={targetRef}>
        {t('What’s the difference?')}
      </TooltipText>
    </Box>
  )
}
