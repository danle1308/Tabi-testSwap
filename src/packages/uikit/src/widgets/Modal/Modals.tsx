import React from 'react'
import { useTheme } from 'styled-components'
import Heading from '../../components/Heading/Heading'
import getThemeValue from '../../util/getThemeValue'
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from './styles'
import { ModalProps } from './types'

interface ModalPropsExtend {
  noHeader?: boolean
  headerPadding?: string | string[]
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
  maxWidth = '482px',
  noHeader = false,
  textScale,
  ...props
}) => {
  const theme = useTheme()
  return (
    <ModalContainer maxWidth={maxWidth} {...props}>
      {/* {noHeader ? null : (
        <ModalHeader
          p={headerPadding}
          background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}
        >
          <ModalTitle>
            {onBack && <ModalBackButton onBack={onBack} />}
            <Heading scale={textScale}>{title}</Heading>
          </ModalTitle>
          {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
        </ModalHeader>
      )} */}

      <ModalBody p={bodyPadding}>{children}</ModalBody>
    </ModalContainer>
  )
}

export default Modal
