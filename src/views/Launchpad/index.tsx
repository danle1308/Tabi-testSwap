import { Text, Flex, Box } from 'packages/uikit'
import { FlexGap } from 'components/Layout/Flex'
import MultiBanners from './components/Banners/MultiBanners'
import Page from './Page'

const LaunchpadPage = () => {
  return (
    <Page>
      <Flex flexDirection="column" justifyContent="center" alignItems="center" mb="36px">
        <FlexGap gap="0">
          <Text bold as="h2" fontSize="40px" color="venusMainColor">
            Venus
          </Text>
          <Text bold as="h2" fontSize="40px" color="venusWhiteColor">
            Pad
          </Text>
        </FlexGap>

        <Box maxWidth="660px">
          <Text as="p" textAlign="center" fontSize="20px" color="venusWhiteColor">
            Unleash the power of early-stage Web3 projects through a leading reputable and secure funding platform
          </Text>
        </Box>
      </Flex>

      <MultiBanners />
    </Page>
  )
}

export default LaunchpadPage
