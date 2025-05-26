import styled from 'styled-components'
import {
  ChartIcon,
  Flex,
  Heading,
  HistoryIcon,
  IconButton,
  NotificationDot,
  Text,
  useModal,
  ChartDisableIcon,
  useMatchBreakpoints,
} from 'packages/uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import RefreshIcon from 'components/Svg/RefreshIcon'

interface Props {
  title: string
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
  topIconSetting?: string
  rightIconSetting?: string
}

const CurrencyInputContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 15px 20px 0px 20px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 36px 26px 10px 30px;
  }
`

const StyledHeading = styled(Text).attrs({ fontSize: [16, , , , 32], fontWeight: 800 })``

const StyledText = styled(Text).attrs({ fontSize: [12, , , , 14] })``

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textScroll};
`

const CurrencyInputHeader: React.FC<Props> = ({
  title,
  subtitle,
  setIsChartDisplayed,
  isChartDisplayed,
  hasAmount,
  onRefreshPrice,
  topIconSetting = '-15px',
  rightIconSetting = '-10px',
}) => {
  const [expertMode] = useExpertModeManager()
  const { isMobile } = useMatchBreakpoints()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

  return (
    <CurrencyInputContainer>
      <Flex width="100%" flexDirection="column" justifyContent="space-between" style={{ gap: '0px' }}>
        <Flex alignItems="flex-start" width="100%" justifyContent="space-between" position="relative">
          <StyledHeading as="h2">{title}</StyledHeading>

          <Flex alignSelf="self-start" style={{ position: 'absolute' }} top={topIconSetting} right={rightIconSetting}>
            <NotificationDot
              show={expertMode}
              width={isMobile ? '7px' : '10px'}
              height={isMobile ? '7px' : '10px'}
              top={isMobile ? '6px' : '0'}
              right={isMobile ? '6px' : '0'}
            >
              <GlobalSettings color="#fff" mr="0" />
            </NotificationDot>
            {/* <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
              <HistoryIcon color="#fff" width="24px" />
            </IconButton>
            <IconButton variant="text" scale="sm" onClick={() => onRefreshPrice()}>
              <RefreshIcon disabled={!hasAmount} width="28px" />
            </IconButton> */}
          </Flex>
        </Flex>
        <StyledText>{subtitle}</StyledText>
      </Flex>
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
