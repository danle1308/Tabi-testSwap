import { useState } from 'react'
import { Button, Text, Flex, Message, Modal, InjectedModalProps, Checkbox, useMatchBreakpoints } from 'packages/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { RowBetween } from 'components/Layout/Row'

interface ExpertModalProps extends InjectedModalProps {
  setShowConfirmExpertModal: (boolean) => void
  setShowExpertModeAcknowledgement: (boolean) => void
}

const ExpertModal: React.FC<ExpertModalProps> = ({
  setShowConfirmExpertModal,
  setShowExpertModeAcknowledgement,
  onDismiss,
}) => {
  const [, toggleExpertMode] = useExpertModeManager()
  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Modal
      title={t('Expert Mode')}
      // onBack={() => setShowConfirmExpertModal(false)}
      // onDismiss={() => setShowConfirmExpertModal(false)}
      onDismiss={onDismiss}
      headerBackground="gradients.cardHeader"
      style={{ maxWidth: isMobile ? '238px' : '414px' }}
      textScale={isMobile ? 'xxs' : 'xs'}
      headerPadding={isMobile ? '15px 15px 10px' : '24px 24px 12px'}
      bodyPadding={isMobile ? '5px 15px 10px' : '12px 24px 24px'}
    >
      <ExpertWarning icon variant="warning" mb={isMobile ? '0px' : '12px'}>
        <Label color="#FDF164" fontWeight="300">
          {t(
            "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
          )}
        </Label>
      </ExpertWarning>
      {/* <Label mb="12px">{t('Only use this mode if you know what you’re doing.')}</Label> */}
      <RowBetween style={{ gap: '1rem' }}>
        <Button
          id="confirm-expert-mode"
          style={{
            width: '50%',
            boxShadow: 'none',
            height: isMobile ? '20px' : '30px',
            borderRadius: '5px',
            fontSize: isMobile ? '10px' : '14px',
          }}
          onClick={() => {
            // eslint-disable-next-line no-alert
            if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
              toggleExpertMode()
              setShowConfirmExpertModal(false)
              onDismiss?.()
              if (isRememberChecked) {
                setShowExpertModeAcknowledgement(false)
              }
            }
          }}
        >
          {t('Turn On')}
        </Button>
        <CancelButton
          onClick={() => {
            setShowConfirmExpertModal(false)
            onDismiss?.()
          }}
        >
          {t('Cancel')}
        </CancelButton>
      </RowBetween>

      <Flex alignItems="center" mt={isMobile ? '0rem' : '0.7rem'}>
        <ExpertCheckbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={() => setIsRememberChecked(!isRememberChecked)}
          scale="sm"
        />
        <Label color="textSubtle" style={{ userSelect: 'none' }} fontWeight="300">
          {t('Don’t show this again')}
        </Label>
      </Flex>
    </Modal>
  )
}

export default ExpertModal

const ExpertWarning = styled(Message)`
  border: 1px solid rgba(250, 250, 250, 0.2);
  border-radius: px;
  background-color: #333333;
  padding: 15px;
`

const CancelButton = styled(Button)`
  background-color: rgba(180, 180, 180, 0.66);
  color: ${({ theme }) => theme.colors.WhiteColor};
  width: 50%;
  height: 20px;
  box-shadow: none;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 400;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
    height: 30px;
  }
`

const ExpertCheckbox = styled(Checkbox)`
  border-radius: 4px;

  &:hover:not(:disabled):not(:checked) {
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.MainColor};

    &:after {
      border-color: ${({ theme }) => theme.colors.BlackColor};
    }
  }
`

const Label = styled(Text).attrs({
  fontSize: [10, , , , 14],
  // color: 'var(--color-white-80)',
})``
