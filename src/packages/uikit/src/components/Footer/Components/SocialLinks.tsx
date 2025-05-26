import React from 'react'
import styled from 'styled-components'
import { darkColors } from '../../../theme'
import { FlexProps } from '../../Box'
import Flex from '../../Box/Flex'
// import Dropdown from '../../Dropdown/Dropdown'
import Link from '../../Link/Link'
import { socials } from '../config'

const SocialLinks: React.FC<FlexProps> = ({ ...props }) => (
  <Flex {...props}>
    {socials.map((social, index) => {
      const iconProps = {
        width: '46px',
        height: '32px',
        color: darkColors.textSubtle,
        style: { cursor: 'pointer' },
      }
      const Icon = social.icon
      const mr = index < socials.length - 1 ? '8px' : 0

      return (
        <Link external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
          <Icon {...iconProps} />
        </Link>
      )
    })}
  </Flex>
)

export default React.memo(SocialLinks, () => true)

// const StyledSocialLinks = styled(Flex)`
//   position: relative;

//   ${({ theme }) => theme.mediaQueries.md} {
//     position: absolute;
//     left: 50%;
//     transform: translateX(-50%);
//   }
// `
