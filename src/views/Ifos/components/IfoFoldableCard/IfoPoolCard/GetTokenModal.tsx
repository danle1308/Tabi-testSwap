import { Modal, ModalBody, Text, Image, Button, Link, OpenNewIcon } from 'packages/uikit'
import { Token } from '@tabi-dex/sdk'
import { useTranslation } from 'contexts/Localization'
import getTokenLogoURL from 'utils/getTokenLogoURL'

interface Props {
  currency: Token
  onDismiss?: () => void
}

const GetTokenModal: React.FC<Partial<Props>> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  return (
    <Modal title={t('%symbol% required', { symbol: currency.symbol })} onDismiss={onDismiss}>
      <ModalBody maxWidth="288px">
        <Image src={getTokenLogoURL(currency.address)} width={72} height={72} margin="auto" mb="24px" />
        <Text mb="16px">
          {t('You’ll need %symbol% tokens to participate in the IFO!', { symbol: currency.symbol })}
        </Text>
        <Text mb="24px">
          {t('Get %symbol%, or make sure your tokens aren’t staked somewhere else.', { symbol: currency.symbol })}
        </Text>
        <Button
          as={Link}
          external
          href={`/swap?outputCurrency=${currency.address}`}
          endIcon={<OpenNewIcon color="white" />}
          minWidth="100%" // Bypass the width="fit-content" on Links
        >
          {t('Get %symbol%', { symbol: currency.symbol })}
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default GetTokenModal
