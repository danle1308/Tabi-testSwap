import { useCallback, memo } from 'react'
import { useModal, Skeleton } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePool } from 'state/pools/hooks'
import { UIButton } from 'components/TabiSwap/components/ui'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'

const AddCakeButton: React.FC<AddButtonProps> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  stakingTokenBalance,
}) => {
  const {
    pool: { userDataLoaded },
  } = usePool(0)

  const { t } = useTranslation()

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      currentLockedAmount={currentLockedAmount}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      lockEndTime={lockEndTime}
      stakingTokenBalance={stakingTokenBalance}
    />,
    true,
    true,
    'AddAmountModal',
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const handleClicked = useCallback(() => {
    return currentBalance.gt(0) ? openAddAmountModal() : onPresentTokenRequired()
  }, [currentBalance, openAddAmountModal, onPresentTokenRequired])

  return userDataLoaded ? (
    <UIButton.UIStyledButton onClick={handleClicked} width="100%">
      {t('Add TABI')}
    </UIButton.UIStyledButton>
  ) : (
    <Skeleton height={48} />
  )
}

export default memo(AddCakeButton)
