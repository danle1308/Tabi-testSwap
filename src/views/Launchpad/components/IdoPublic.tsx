import { Flex, Text, Progress } from 'packages/uikit'
import { LaunchpadTextBlock } from 'components/venuswap/components/launchpad'
import { FlexGap } from 'components/Layout/Flex'
import { IdoContentWrapper } from './styles'

const isPublic = true

const IdoPublic = () => {
  return (
    <IdoContentWrapper>
      <FlexGap flexDirection="column" gap="16px">
        <Flex alignItems="center">
          <Text bold>EarnTV IDO | Public Sale</Text>
          <img
            src={isPublic ? '/images/venus/svgs/safe-icon.svg' : '/images/venus/svgs/non-safe-icon.svg'}
            alt="public-icon"
          />
        </Flex>

        <Text bold fontSize="30px" color="venusMainColor">
          25 ETH
        </Text>

        <Progress primaryStep={50} scale="sm" />

        <LaunchpadTextBlock main="50%" sub="of Funds Progress" />

        <LaunchpadTextBlock main="500.000 ETV" sub="Total Tokens Sold " />
      </FlexGap>
    </IdoContentWrapper>
  )
}

export default IdoPublic
