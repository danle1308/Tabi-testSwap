import { Token } from '@tabi-dex/sdk'
import { Flex, Message, MessageText, useMatchBreakpoints, Text } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { memo } from 'react'
import { useVaultApy } from 'hooks/useVaultApy'

import ExtendButton from '../Buttons/ExtendDurationButton'
import useAvgLockDuration from '../hooks/useAvgLockDuration'

interface ConvertToLockProps {
  stakingToken: Token
  currentStakedAmount: number
  isInline?: boolean
}

const ConvertToLock: React.FC<ConvertToLockProps> = ({ stakingToken, currentStakedAmount, isInline }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const isTableView = isInline && !isMobile
  const { avgLockDurationsInSeconds } = useAvgLockDuration()

  const { lockedApy } = useVaultApy({ duration: avgLockDurationsInSeconds })

  return (
    <Message
      variant="warning"
      action={
        <Flex mt={!isTableView && '8px'} flexGrow={1} ml={isTableView && '20px'}>
          <ExtendButton
            modalTitle={t('Convert to Lock')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentStakedAmount}
            height="35px"
          >
            <Text ellipsis color="BlackColor" bold fontSize={['0.875rem']}>
              {t('Convert to Lock')}
            </Text>
          </ExtendButton>
        </Flex>
      }
      actionInline={isTableView}
    >
      <MessageText>
        {t('Lock staking users are earning an average of %amount%% APY. More benefits are coming soon.', {
          amount: lockedApy ? parseFloat(lockedApy).toFixed(2) : 0,
        })}
      </MessageText>
    </Message>
  )
}

export default memo(ConvertToLock)
