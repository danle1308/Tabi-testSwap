import { Button } from 'packages/uikit'

import { useTranslation } from 'contexts/Localization'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()

  return (
    <Button {...props} disabled>
      {t('Stake in IFO pool')}
    </Button>
  )
}

export default StakeVaultButton
