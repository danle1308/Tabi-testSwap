import { useTranslation } from 'contexts/Localization'
import { Text, Link, LinkExternal } from 'packages/uikit'

const BTTWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t(
          'Please note that this is the old BTT token, which has been swapped to the new BTT tokens in the following ratio:',
        )}
      </Text>
      <Text>1 BTT (OLD) = 1,000 BTT (NEW)</Text>
      <Text mb="8px">
        {t('Trade the new BTT token')}{' '}
        <Link style={{ display: 'inline' }} href="/">
          {t('here')}
        </Link>
      </Text>
      <LinkExternal>{t('For more details on the swap, please refer here.')}</LinkExternal>
    </>
  )
}

export default BTTWarning
