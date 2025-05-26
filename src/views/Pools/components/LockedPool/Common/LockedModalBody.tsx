import { useMemo } from 'react'
import { AutoRenewIcon, Box, Flex } from 'packages/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import { MAX_LOCK_DURATION } from 'config/constants/pools'
import { getBalanceAmount } from 'utils/formatBalance'
import styled from 'styled-components'
import { UIButton } from 'components/TabiSwap/components/ui'
import { LockedModalBodyPropsType, ModalValidator } from '../types'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from '../hooks/useLockedPool'

const LockedModalBody: React.FC<LockedModalBodyPropsType> = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentBalance,
  editAmountOnly,
  prepConfirmArg,
  validator,
  customOverview,
}) => {
  const { t } = useTranslation()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
  })

  const { isValidAmount, isValidDuration, isOverMax }: ModalValidator = useMemo(() => {
    return typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount?.toNumber() > 0 && getBalanceAmount(currentBalance).gte(lockedAmount),
          isValidDuration: duration > 0 && duration <= MAX_LOCK_DURATION,
          isOverMax: duration > MAX_LOCK_DURATION,
        }
  }, [validator, currentBalance, lockedAmount, duration])

  const StyledButton = styled(UIButton.UIStyledActionButton)`
    height: 60px !important;
    &.pancake-button--disabled {
      background: #999999;
    }
  `

  return (
    <>
      <Box mb="16px">
        {editAmountOnly || <LockDurationField isOverMax={isOverMax} setDuration={setDuration} duration={duration} />}
      </Box>
      {customOverview ? (
        customOverview({
          isValidDuration,
          duration,
        })
      ) : (
        <Overview
          isValidDuration={isValidDuration}
          openCalculator={_noop}
          duration={duration}
          lockedAmount={lockedAmount?.toNumber()}
          usdValueStaked={usdValueStaked}
          showLockWarning
        />
      )}

      <Flex mt="24px">
        <StyledButton
          width="100%"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!(isValidAmount && isValidDuration)}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </StyledButton>
      </Flex>
    </>
  )
}

export default LockedModalBody
