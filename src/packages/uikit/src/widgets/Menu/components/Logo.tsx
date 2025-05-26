import React, { useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import Flex from '../../../components/Box/Flex'
// import { LogoIcon, LogoWithTextIcon } from '../../../components/Svg'
import { MenuContext } from '../context'
import { Text } from '../../../components/Text'
import { useMatchBreakpoints } from '../../../hooks'

interface Props {
  href: string
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); }
  50% { transform:  scaleY(0.1); }
`

const StyledLink = styled('a')`
  display: flex;
  align-items: center;
  height: 100%;

  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 36px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
  .eye {
    animation-delay: 20ms;
  }
  &:hover {
    .eye {
      transform-origin: center 60%;
      animation-name: ${blink};
      animation-duration: 350ms;
      animation-iteration-count: 1;
    }
  }

  img {
  }
`

const StyledLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  font-weight: 700;
  color: white;

  img {
    display: flex;
    flex-shrink: 0;
    /* width: 36px; */
    margin-right: 8px;
  }
`

const Logo: React.FC<Props> = ({ href }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { linkComponent } = useContext(MenuContext)
  const isAbsoluteUrl = href.startsWith('http')

  const innerLogo = (
    <StyledLogo>
      <img alt="logo desktop" className="desktop-icon" src="/images/logo.svg" />
      <img alt="logo mobile" className="mobile-icon" src="/images/logo.svg" />
      <Text
        mt="5px"
        mr={isTablet ? '1rem' : '0'}
        color="primary"
        fontFamily="Modak"
        fontSize={[19, , , , 36]}
        display={['block', , , , 'block']}
      >
        Tabi
        <Text as="span" fontFamily="Modak" fontSize={[19, , , , 36]}>
          swap
        </Text>
      </Text>
    </StyledLogo>
  )

  return (
    <Flex alignItems="center">
      {isAbsoluteUrl ? (
        <StyledLink href="/swap" as="a" aria-label="Home page">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href="/swap" as={linkComponent} aria-label="Home page">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark)
