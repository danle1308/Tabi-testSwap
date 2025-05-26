import { Flex, Text } from 'packages/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import { IdoContentWrapper } from './styles'

const SocialLinks = ({ socials = [] }) => {
  return (
    <IdoContentWrapper>
      <Flex justifyContent="space-between">
        <Text>Social Links</Text>

        {typeof socials !== undefined && socials?.length <= 0 ? (
          <Text>Not found any social links</Text>
        ) : (
          <SocialMenu>
            {socials.map((social) => (
              <NextLinkFromReactRouter to="/swap" target="_blank">
                <img src={social.icon} alt="social-link" />
              </NextLinkFromReactRouter>
            ))}
          </SocialMenu>
        )}
      </Flex>
    </IdoContentWrapper>
  )
}

export default SocialLinks

const SocialMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 10px;
`
