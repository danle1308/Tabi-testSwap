import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ChevronLeftIcon, ArrowBackIcon, NotificationDot } from 'packages/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { useState } from 'react'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
  paddingHeading?: string
  borderBottom?: string
  padding?: string
  titleFontSize?: string
  titleFontWeight?: string | number
  titleColor?: string
}

const AppHeaderContainer = styled(Flex)`
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  /* padding: 24px; */
  width: 100%;
`

const StyledHeading = styled(Heading).attrs({ fontSize: [16, , , , 20], fontWeight: 500 })``

const StyledSubTitle = styled(Text).attrs({ fontSize: [12, , , , 14] })``

const BackButton = styled(IconButton)`
  width: auto;
`

const IconWrapper = styled(Flex)`
  gap: 0;
`

const AppHeader: React.FC<Props> = ({
  title,
  subtitle,
  helper,
  backTo,
  noConfig = false,
  paddingHeading,
  borderBottom,
  padding,
  titleFontSize,
  titleFontWeight,
  titleColor,
}) => {
  const [expertMode] = useExpertModeManager()
  const [isDisable] = useState(true)

  return (
    <AppHeaderContainer>
      <Flex
        borderBottom={borderBottom}
        padding={padding}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex flexDirection="column" mr={noConfig ? 0 : '16px'}>
          <Flex alignItems="center">
            {backTo && (
              <Link passHref href={backTo}>
                <BackButton as="a">
                  <ChevronLeftIcon color="#ffffff" width="12px" />
                </BackButton>
              </Link>
            )}
            <StyledHeading
              useGradient={!titleColor}
              fontSize={titleFontSize}
              fontWeight={titleFontWeight}
              color={titleColor}
              as="h2"
            >
              {title}
            </StyledHeading>
          </Flex>
        </Flex>
        {!noConfig && (
          <IconWrapper alignItems="center">
            <NotificationDot show={expertMode}>
              <GlobalSettings mr="0" color="#ffffff" />
            </NotificationDot>

            <Transactions />

            <IconButton variant="text" scale="sm">
              <RefreshIcon disabled={isDisable} width="28px" />
            </IconButton>
          </IconWrapper>
        )}
      </Flex>

      <Flex alignItems="center" style={{ gap: '5px' }}>
        {helper && <QuestionHelper text={helper} mr="0px" placement="top-start" />}
        <StyledSubTitle color="WhiteColor">{subtitle}</StyledSubTitle>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
