import { useState } from 'react'
import styled from 'styled-components'
import {
  Text,
  // PancakeToggle,
  Toggle,
  Flex,
  InjectedModalProps,
  // ThemeSwitcher,
  useModal,
  Box,
  Button,
  useMatchBreakpoints,
} from 'packages/uikit'
import {
  useAudioModeManager,
  useExpertModeManager,
  // useSubgraphHealthIndicatorManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
} from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
// import useTheme from 'hooks/useTheme'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
// import GasSettings from './GasSettings'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  max-height: 400px;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const ButtonsToggleWrapper = styled(Flex)`
  gap: 0;
  height: 12px;
  overflow: hidden;
  width: 50px;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 15px;
    width: 71px;
  }
`

const ButtonToggle = styled(Button).attrs({
  variant: 'text',
  height: 'auto',
  padding: '0 10px',
})`
  font-size: 8px;
  font-weight: 400;
  width: 25px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    font-size: 10px;
  }
`

const FlexBorderLeft = styled(Flex)`
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  width: 25px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
  }
`

const FlexBorderRight = styled(Flex)`
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;

  width: 25px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
  }
`

const Label = styled(Text).attrs({
  color: 'var(--color-white-80)',
})`
  font-size: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 12px;
  }
`

const SettingsBox: React.FC<
  InjectedModalProps & {
    onClose: () => void
  }
> = ({ onClose, onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  // const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const { onChangeRecipient } = useSwapActionHandlers()

  const [onPresentExpertModal] = useModal(
    <ExpertModal
      setShowConfirmExpertModal={setShowConfirmExpertModal}
      onDismiss={onDismiss}
      setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
    />,
  )

  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const handleExpertModeToggle = () => {
    if (expertMode) {
      console.log('====')
      onChangeRecipient(null)
      toggleExpertMode()
      onClose()
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
      onClose()
    } else {
      setShowConfirmExpertModal(true)
      onPresentExpertModal()
      onClose()
    }
  }

  return (
    <Box padding={['0.5rem 0.8rem', , , , '1rem']}>
      <ScrollableContainer>
        <TransactionSettings />
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Label>{t('Expert Mode')}</Label>
          </Flex>
          <ButtonsToggleWrapper>
            <FlexBorderLeft
              background={expertMode ? 'var(--color-primary)' : 'transparent'}
              style={{ border: expertMode ? 'none' : '1px solid white' }}
            >
              <ButtonToggle onClick={handleExpertModeToggle}>On</ButtonToggle>
            </FlexBorderLeft>
            <FlexBorderRight
              background={!expertMode ? 'var(--color-primary)' : 'transparent'}
              style={{ border: !expertMode ? 'none' : '1px solid white' }}
            >
              <ButtonToggle onClick={handleExpertModeToggle}>Off</ButtonToggle>
            </FlexBorderRight>
          </ButtonsToggleWrapper>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Label>{t('Sound')}</Label>
            {/* <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top-start" ml="4px" /> */}
          </Flex>
          {/* <Toggle
            id="toggle-disable-multihop-button"
            checked={singleHopOnly}
            scale="md"
            onChange={() => {
              setSingleHopOnly(!singleHopOnly)
            }}
          /> */}
          <ButtonsToggleWrapper>
            {/* <Toggle checked={audioPlay} onChange={toggleSetAudioMode} scale="md" /> */}
            <FlexBorderLeft
              background={audioPlay ? 'var(--color-primary)' : 'transparent'}
              style={{ border: audioPlay ? 'none' : '1px solid white' }}
            >
              <ButtonToggle
                onClick={() => {
                  toggleSetAudioMode()
                }}
              >
                On
              </ButtonToggle>
            </FlexBorderLeft>
            <FlexBorderRight
              background={!audioPlay ? 'var(--color-primary)' : 'transparent'}
              style={{ border: !audioPlay ? 'none' : '1px solid white' }}
            >
              <ButtonToggle
                onClick={() => {
                  toggleSetAudioMode()
                }}
              >
                Off
              </ButtonToggle>
            </FlexBorderRight>
          </ButtonsToggleWrapper>
        </Flex>
      </ScrollableContainer>
    </Box>
  )
}

export default SettingsBox
