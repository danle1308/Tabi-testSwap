import Page from 'views/Page'
import { Box, Heading, Text } from 'packages/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { UIButton } from 'components/TabiSwap/components/ui'
import styled from 'styled-components'

const MintNFTPage = () => {
  return (
    <Page>
      {/* <Main background="#101315" maxWidth="649px" width="100%" borderRadius="16px">
        <FlexGap justifyContent="center" alignItems="center" flexDirection="column" gap="32px">
          <Text fontSize="clamp(32px,4vw,50px)" color="MainColor">
            TabiSwap NFTs
          </Text>

          <img src="/images/mint-nft.svg" alt="mint" />

          <MintButton>Mint</MintButton>
        </FlexGap>
      </Main> */}
    </Page>
  )
}

export default MintNFTPage

const Main = styled(Box)`
  padding: 32px;
  margin: 3rem auto 0 auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 4rem auto 5rem auto;
  }
`

const MintButton = styled(UIButton.UIStyledActionButton)`
  max-width: 354px;
  width: 100%;
  min-height: 44px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 72px;
  }
`
