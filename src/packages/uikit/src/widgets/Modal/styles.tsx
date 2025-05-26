import React from 'react'
import styled from 'styled-components'
import Flex from '../../components/Box/Flex'
import { Box } from '../../components/Box'
import { ArrowBackIcon, CloseIcon, ChevronLeftIcon } from '../../components/Svg'
import { IconButton } from '../../components/Button'
import { ModalProps } from './types'
import { useMatchBreakpoints } from '../../hooks'

export const ModalHeader = styled(Flex)<{ background?: string }>`
  position: relative;
  align-items: center;
`

export const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  color: ${({ theme }) => theme.colors.MainColor};
`

export const ModalBody = styled(Flex)`
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
`

export const ModalCloseButton: React.FC<{
  onDismiss: ModalProps['onDismiss']
  iconColor?: string
  topIconButton?: string
  rightIconButton: string
}> = ({ onDismiss, iconColor = 'WhiteColor', topIconButton = '10px', rightIconButton = '12px' }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <IconButton
      style={{ width: 'fit-content', height: 'auto', position: 'absolute', right: rightIconButton, top: topIconButton }}
      variant="text"
      onClick={onDismiss}
      aria-label="Close the dialog"
    >
      <CloseIcon width={isMobile ? 12 : 20} height={isMobile ? 12 : 20} color={iconColor} />
    </IconButton>
  )
}

export const ModalBackButton: React.FC<{ onBack: ModalProps['onBack'] }> = ({ onBack }) => {
  return (
    <IconButton style={{ width: 'fit-content' }} variant="text" onClick={onBack} area-label="go back" mr="8px">
      <ChevronLeftIcon color="#ffffff" width={10} />
    </IconButton>
  )
}

export const ModalContainer = styled(Box)<{ maxWidth: string }>`
  overflow: hidden;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndices.modal};
  border-radius: 16px;
  border: 1px solid var(--color-white-50);
  /* background: ${({ theme }) => theme.colors.ModalBg}; */
  background: var(--color-black);
  background-size: contain;
  position: relative;
`
