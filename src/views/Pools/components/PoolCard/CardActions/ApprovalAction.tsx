import { AutoRenewIcon, Skeleton } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { DeserializedPool } from 'state/types'
import { UIButton } from 'components/TabiSwap/components/ui'
import { useApprovePool } from '../../../hooks/useApprove'

interface ApprovalActionProps {
  pool: DeserializedPool
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove, pendingTx } = useApprovePool(stakingTokenContract, sousId, earningToken.symbol)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <UIButton.UIStyledActionButton
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={pendingTx}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </UIButton.UIStyledActionButton>
      )}
    </>
  )
}

export default ApprovalAction
