import { FlexGap } from 'components/Layout/Flex'
import { Heading, Text } from 'packages/uikit'
import Page from './Page'
import { IdoBanner, IdoRightSection, IdoLeftSection } from './styles'
import { IdoContentWrapper } from './components/styles'
import SocialLinks from './components/SocialLinks'
import IdoInfo from './components/IdoInfo'
import IdoPublic from './components/IdoPublic'

const IdoPage = () => {
  return (
    <Page>
      <FlexGap justifyContent="space-between" gap="24px" width="100%">
        {IdoPageRight()}
        {IdoPageLeft()}
      </FlexGap>
    </Page>
  )
}

export default IdoPage

const IdoPageRight = () => {
  return (
    <IdoRightSection flexDirection="column" gap="24px">
      <IdoBanner>
        <img src="/images/venus/venus-banner-2.png" alt="" />
      </IdoBanner>

      <SocialLinks />

      <IdoContentWrapper padding="24px 36px">
        <Heading scale="lg" color="venusMainColor" mb="12px">
          EarnTV® Watch. Engage. Earn.🎬
        </Heading>

        <Text fontStyle="italic" mb="24px">
          Introducing the new way to stream content 🎞
        </Text>

        <Text bold>EarnTV — The decentralized streaming and content viewing platform</Text>
        <br />
        <Text fontSize="14px">
          EarnTV is the first entertainment platform to offer all stakeholders a seat at the table. From viewers to
          advertisers and library owners, everyone gets the chance to earn. With a freemium model which combines
          Advertised Video and Demand (AVOD) with exclusive Premium Video on Demand (PVOD) content, EarnTV has the
          potential to reach an enormous global audience. <br /> <br />
          By utilizing a Web3 tokenized rewards system, EarnTV can offer viewers something most other streaming
          platforms can’t: money for their attention. Whenever a user views an ad or watches sponsored content, they
          earn $ETV tokens for their valuable time. For advertisers, this system leads to higher engagement and the
          possibility for new and exciting ways to connect with their audiences. <br /> <br /> The kind of engagement
          the EarnTV platform offers to advertisers is also available to content owners. Web3 functionality means
          content libraries can monetize exclusive access to things like behind-the-scenes footage or community events
          with stars, creating new ways to connect with audiences and increase revenues. For audiences, this also gives
          the possibility to form deeper connections with the shows and stars they love and to create new communities
          around their favorite shows and movies — all while earning $ETV tokens for their engagement. <br /> <br />{' '}
          Unlike many other rewards tokens which offer very little in the way of utility, $ETV can be used throughout
          the EarnTV platform as well as in a massive network of retail partners. On the platform, $ETV unlocks
          discounts and can be used for payments on exclusive content. Outside of the platform, holders can convert $ETV
          into vouchers redeemable at thousands of big-name <br /> <br />
        </Text>

        <Text bold>New ways to earn</Text>
        <br />
        <Text fontSize="14px">
          EarnTV brings Web3 tokenized rewards to all our video content. And with EarnTV, there’s more than one way to
          earn. <br /> <br />
        </Text>

        <Text bold>Stream-to-Earn</Text>
        <br />
        <Text fontSize="14px">
          Stream-to-Earn, or Watch-to-Earn, rewards users for doing what they love doing — watching content. Users
          watching free content receive unintrusive advertising content, but unlike other platforms which force you to
          watch them without any kind of incentive, EarnTV rewards users for the spots they see. It’s your time, so it’s
          only fair you get a cut of the advertising revenue. <br /> <br />
        </Text>

        <Text bold>Refer-to-Earn</Text>
        <br />
        <Text fontSize="14px">
          We think what we’re doing is pretty great, but it makes sense that some people might be skeptical about
          hearing it from us. With Refer-to-Earn rewards we can tap into the greatest marketing asset we have — our
          satisfied users.By inviting friends and family to join EarnTV, you can earn rewards for the signups.
          High-profile and active users can also become EarnTV Ambassadors, with even more great reward opportunities
          available for their valuable efforts. <br /> <br />
        </Text>

        <Text bold>Contact us to know more or for an interview: contact@earntv.io</Text>
        <br />
      </IdoContentWrapper>
    </IdoRightSection>
  )
}

const IdoPageLeft = () => {
  return (
    <IdoLeftSection flexDirection="column" gap="24px">
      <IdoInfo />

      <IdoPublic />
    </IdoLeftSection>
  )
}
