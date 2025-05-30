import { useMemo } from 'react'
import { useModal, ButtonProps } from 'packages/uikit'
import { ONE_WEEK_DEFAULT, MAX_LOCK_DURATION } from 'config/constants/pools'

import { UIButton } from 'components/TabiSwap/components/ui'
import ExtendDurationModal from '../Modals/ExtendDurationModal'
import { ExtendDurationButtonPropsType } from '../types'

const ExtendDurationButton: React.FC<ExtendDurationButtonPropsType & ButtonProps> = ({
  modalTitle,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  children,
  ...rest
}) => {
  const nowInSeconds = Date.now() / 1000
  const currentDuration = useMemo(() => Number(lockEndTime) - Number(lockStartTime), [lockEndTime, lockStartTime])
  const currentDurationLeftInSeconds = useMemo(() => Number(lockEndTime) - nowInSeconds, [lockEndTime, nowInSeconds])

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal
      modalTitle={modalTitle}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      currentLockedAmount={currentLockedAmount}
      currentDuration={currentDuration}
    />,
    true,
    true,
    'ExtendDurationModal',
  )

  return (
    <UIButton.UIStyledButton
      disabled={
        Number.isFinite(currentDurationLeftInSeconds) &&
        MAX_LOCK_DURATION - currentDurationLeftInSeconds < ONE_WEEK_DEFAULT
      }
      onClick={openExtendDurationModal}
      width="100%"
      {...rest}
    >
      {children}
    </UIButton.UIStyledButton>
  )
}

export default ExtendDurationButton
