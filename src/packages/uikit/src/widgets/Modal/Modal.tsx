import React from 'react'
import { useTheme } from 'styled-components'
import Heading from '../../components/Heading/Heading'
import getThemeValue from '../../util/getThemeValue'
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from './styles'
import { ModalProps } from './types'

interface ModalPropsExtend {
  noHeader?: boolean
  headerPadding?: string | string[]
  rightIconButton?: string
  topIconButton?: string
}

const Modal: React.FC<ModalProps & ModalPropsExtend> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = ['12px 24px 24px'],
  headerPadding = ['24px 24px 12px'],
  headerBackground = 'transparent',
  maxWidth = '414px',
  noHeader = false,
  textScale,
  hideHeading = false,
  topIconButton,
  rightIconButton,
  ...props
}) => {
  const theme = useTheme()
  return (
    <ModalContainer maxWidth={maxWidth} {...props}>
      {noHeader ? null : (
        <ModalHeader
          p={headerPadding}
          background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}
        >
          <ModalTitle>
            {onBack && <ModalBackButton onBack={onBack} />}
            {!hideHeading && <Heading scale={textScale}>{title}</Heading>}
          </ModalTitle>
        </ModalHeader>
      )}
      {!hideCloseButton && (
        <ModalCloseButton onDismiss={onDismiss} rightIconButton={rightIconButton} topIconButton={topIconButton} />
      )}

      <ModalBody p={bodyPadding}>{children}</ModalBody>
    </ModalContainer>
  )
}

export default Modal
