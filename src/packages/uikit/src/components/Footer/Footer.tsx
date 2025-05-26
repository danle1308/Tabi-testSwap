/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
// import { baseColors, darkColors, lightColors } from '../../theme/colors'
// import { Flex, Box } from '../Box'
import styled from 'styled-components'
// import { Link } from '../Link'
// import {
//   StyledFooter,
//   StyledIconMobileContainer,
//   StyledList,
//   StyledListItem,
//   StyledText,
//   StyledSocialLinks,
//   StyledToolsContainer,
// } from './styles'
// import { FooterProps } from './types'
// import { ThemeSwitcher } from '../ThemeSwitcher'
// import LangSelector from '../LangSelector/LangSelector'
// import CakePrice from '../CakePrice/CakePrice'
// import { LogoWithTextIcon, ArrowForwardIcon } from '../Svg'
// import { Button } from '../Button'
// import { Colors } from '../..'
// import SocialLinks from './Components/SocialLinks'
import { FooterProps } from './types'
// import { footerLinks } from './config'
import { Link } from '../Link'
import { Text } from '../Text'
import { Box, Flex } from '../Box'
import { TwitterIcon, TelegramIcon, DiscordIcon } from '../Svg'

const MainFooter = styled.footer`
  display: flex;
  justify-content: center;
  padding: 36px 10px;
`

const SocialBox = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid var(--color-white)',
  borderRadius: '50%',
  background: 'var(--color-black)',
  width: [45],
  height: [45],
})``

const MenuItem: React.FC<FooterProps> = () => {
  return (
    <>
      <MainFooter>
        <Flex flexDirection="column" alignItems="center">
          <Flex style={{ gap: '1rem' }}>
            <SocialBox as={Link} href="https://x.com/TabiSwap" external>
              <TwitterIcon width="23px" color="#FE1A48" />
            </SocialBox>
            <SocialBox as={Link} href="https://t.me/tabiswap_chat" external>
              <TelegramIcon width="24px" color="#FE1A48" />
            </SocialBox>
            <SocialBox as={Link} href="https://discord.gg/gm9dHg64VS" external>
              <DiscordIcon width="26px" color="#FE1A48" />
            </SocialBox>
          </Flex>
          <Flex alignItems="center">
            <Text color="primary" fontFamily="Modak" fontSize={[32]}>
              Tabi
              <Text as="span" fontFamily="Modak" fontSize={[32]}>
                swap
              </Text>
            </Text>
          </Flex>
          <Text>@2025. Tabiswap. All Rights reserved</Text>
        </Flex>
      </MainFooter>
    </>
  )
}

export default MenuItem
