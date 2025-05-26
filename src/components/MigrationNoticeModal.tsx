import useTheme from 'hooks/useTheme'
import { Box, Modal, Text, useModal, Link, InjectedModalProps, ModalHeader } from 'packages/uikit'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const MigrationLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text} !important;
`

const MigrationWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  justify-content: center;
`

const StyledModal = styled(Modal)`
  /* height: 68%; */
  > ${ModalHeader} {
    background: unset !important;
  }
`

const STORAGE_KEY = 'VEN_V2_Migration_Notice_Modal'

const MigrationNoticeModalWrapper: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { theme } = useTheme()

  return (
    <StyledModal
      title="Migration to V2"
      onDismiss={() => {
        try {
          localStorage.setItem(STORAGE_KEY, 'true')
        } catch (error) {
          console.error(error)
        }

        onDismiss()
      }}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Box>
        <Text>{`Can't find your funds?`}</Text>
        <Text>Please migrate your pools and farms to V2</Text>
        <MigrationWrapper>
          <MigrationLink href="/migration" className="text">
            Go to migration page
          </MigrationLink>
        </MigrationWrapper>
      </Box>
    </StyledModal>
  )
}

export const MigrationNoticeModal = () => {
  const [onPresent] = useModal(<MigrationNoticeModalWrapper />, false)

  useEffect(() => {
    const check = () => {
      try {
        const value = localStorage.getItem(STORAGE_KEY)
        if (value !== 'true') {
          onPresent()
        }
      } catch (error) {
        console.error(error)
      }
    }
    check()
  }, [])

  return null
}
