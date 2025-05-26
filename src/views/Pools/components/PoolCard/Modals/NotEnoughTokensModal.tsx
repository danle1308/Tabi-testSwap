import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Modal, Text, Button, OpenNewIcon, Link, ModalHeader } from 'packages/uikit'
import useTheme from 'hooks/useTheme'
import { UIButton } from 'components/TabiSwap/components/ui'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const StyledModal = styled(Modal)`
  /* height: 68%; */

  > ${ModalHeader} {
    background: unset !important;
  }
`

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <StyledModal
      title={t('%symbol% required', { symbol: tokenSymbol })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Text color="WhiteColorLight" bold>
        {t('Insufficient %symbol% balance', { symbol: tokenSymbol })}
      </Text>
      <Text mt="24px">{t('You’ll need %symbol% to stake in this pool!', { symbol: tokenSymbol })}</Text>
      <Text>
        {t('Buy some %symbol%, or make sure your %symbol% isn’t in another pool or LP.', {
          symbol: tokenSymbol,
        })}
      </Text>
      <UIButton.UIStyledActionButton mt="24px" as="a" external href="/swap">
        {t('Buy')} {tokenSymbol}
      </UIButton.UIStyledActionButton>
      <StyledLink href="/swap">
        <UIButton.UIStyledActionButton mt="8px" width="100%">
          {t('Locate Assets')}
          <OpenNewIcon color="BlackColor" ml="4px" />
        </UIButton.UIStyledActionButton>
      </StyledLink>
      <Button variant="text" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </StyledModal>
  )
}

export default NotEnoughTokensModal
