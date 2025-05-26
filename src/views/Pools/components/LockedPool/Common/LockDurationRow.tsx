import { Flex, Text } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'

const LockDurationRow = ({ weekDuration }) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text color="textSubtle" fontSize="14px">
        {t('Lock Duration')}
      </Text>
      <Text color="text" fontSize="14px">
        {weekDuration}
      </Text>
    </Flex>
  )
}

export default LockDurationRow
