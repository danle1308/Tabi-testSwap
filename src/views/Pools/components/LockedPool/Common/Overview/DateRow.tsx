import { useTranslation } from 'contexts/Localization'
import { Text, Flex, TooltipText, useTooltip } from 'packages/uikit'
import { format } from 'date-fns'

interface PropsType {
  title: React.ReactNode
  value: Date
  color: string
}

const DateRow: React.FC<PropsType> = ({ title, value, color }) => {
  const { t } = useTranslation()
  const tooltipContent = t(
    'You will be able to withdraw the staked TABI and profit only when the staking position is unlocked, i.e. when the staking period ends.',
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText>
        <Text ref={targetRef} color="WhiteColor" fontSize="14px">
          {title}
        </Text>
      </TooltipText>
      <Text fontSize="14px" color={color}>
        {value ? format(value, 'MMM do, yyyy HH:mm') : '-'}
      </Text>
    </Flex>
  )
}

export default DateRow
