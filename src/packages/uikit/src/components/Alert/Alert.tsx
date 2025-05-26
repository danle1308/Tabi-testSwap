import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import CheckmarkCircleIcon from '../Svg/Icons/CheckmarkCircle'
import ErrorIcon from '../Svg/Icons/Error'
import BlockIcon from '../Svg/Icons/Block'
import InfoIcon from '../Svg/Icons/Info'
import { Text } from '../Text'
import { IconButton } from '../Button'
import { CloseIcon } from '../Svg'
import Flex from '../Box/Flex'
import { AlertProps, variants } from './types'
import { useMatchBreakpoints } from '../../hooks'

interface ThemedIconLabel {
  variant: AlertProps['variant']
  theme: DefaultTheme
  hasDescription: boolean
}

const getThemeColor = ({ theme, variant = variants.INFO }: ThemedIconLabel) => {
  switch (variant) {
    case variants.DANGER:
      return theme.colors.MainColor
    case variants.WARNING:
      return theme.colors.MainColor
    case variants.SUCCESS:
      return theme.colors.MainColor
    case variants.INFO:
    default:
      // return theme.colors.secondary
      return 'rgba(255, 255, 255, 1)'
  }
}

const getIcon = (variant: AlertProps['variant'] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return BlockIcon
    case variants.WARNING:
      return ErrorIcon
    case variants.SUCCESS:
      return CheckmarkCircleIcon
    case variants.INFO:
    default:
      return InfoIcon
  }
}

const IconLabel = styled.div<ThemedIconLabel>`
  /* background-color: ${getThemeColor};
  color: ${({ theme }) => theme.alert.background}; */
  /* color: ${getThemeColor}; */
  padding: 10px 5px 10px 10px;
`

const TitleBox = styled.div<ThemedIconLabel>`
  /* margin-bottom: 12px; */

  & > ${Text} {
    color: ${getThemeColor};
  }
`

const StyledAlertText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

const withHandlerSpacing = 32 + 12 + 8 // button size + inner spacing + handler position
const Details = styled.div<{ hasHandler: boolean }>`
  flex: 1;
  padding-bottom: 10px;
  padding-left: 0px;
  padding-right: ${({ hasHandler }) => (hasHandler ? `${withHandlerSpacing}px` : '10px')};
  padding-top: 10px;
`

const CloseHandler = styled.div`
  border-radius: 0 16px 16px 0;
  right: 8px;
  position: absolute;
  top: 8px;
`

const StyledAlert = styled(Flex)`
  position: relative;
  overflow: hidden;
  background-color: #202224;
  /* box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05); */
  /* border: 1px solid #fff; */
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  align-items: center;
`

const Alert: React.FC<AlertProps> = ({ title, children, variant, onClick }) => {
  const Icon = getIcon(variant)
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledAlert>
      <IconLabel variant={variant} hasDescription={!!children}>
        <Icon color="currentColor" width={isMobile ? '15px' : '23px'} />
      </IconLabel>
      <Details hasHandler={!!onClick}>
        <TitleBox variant={variant} hasDescription={!!children}>
          <StyledAlertText fontWeight="400" color="currentColor">
            {title}
          </StyledAlertText>
        </TitleBox>
        {/* {typeof children === 'string' ? (
          <StyledAlertText bold as="p" fontSize={[14]}>
            {children}
          </StyledAlertText>
        ) : (
          children
        )} */}
      </Details>
      {/* {onClick && (
        <CloseHandler>
          <IconButton scale="sm" variant="text" onClick={onClick}>
            <CloseIcon width="24px" color="WhiteColor" />
          </IconButton>
        </CloseHandler>
      )} */}
    </StyledAlert>
  )
}

export default Alert
