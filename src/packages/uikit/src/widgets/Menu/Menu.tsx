import throttle from 'lodash/throttle'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import BottomNav from '../../components/BottomNav'
import { Box } from '../../components/Box'
import Flex from '../../components/Box/Flex'
// eslint-disable-next-line import/no-cycle
import Footer from '../../components/Footer'
import MenuItems from '../../components/MenuItems/MenuItems'
import { SubMenuItems } from '../../components/SubMenuItems'
import { useMatchBreakpoints, useOnClickOutside } from '../../hooks'
// import CakePrice from '../../components/CakePrice/CakePrice'
import Logo from './components/Logo'
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from './config'
import { NavProps } from './types'
import { MenuContext } from './context'
import { Link } from '../../components/Link'
import { MenuIcon, TelegramIcon, TwitterIcon } from '../../components/Svg'
import { Button } from '../../components/Button'
// import LangSelector from '../../components/LangSelector/LangSelector'
// import ConnectedParticles from './CanvasBg'

const Wrapper = styled.div`
  position: relative;
  /* background-color: ${({ theme }) => theme.colors.BgColor}; */
  min-height: 100vh;
  overflow-x: hidden;

  /* background: url('/images/bg.svg') no-repeat; */

  &:after {
    content: '';
    position: fixed;
    z-index: -9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background: url('/images/bg-16x9.svg') no-repeat;
    background-position: center;
    background-size: cover;
  }
`

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  transform: translate3d(0, 0, 0);
  height: 100%;
`

// const SocialGroup = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 100%;
// `

// const SocialLink = styled.a``

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  /* display: none; */
  width: 100%;
  height: 48px;
  position: relative;
  z-index: 9;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex-direction: column;
    height: 100px;
  }
`

const FlexHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 0.7rem;
  width: 100%;
  height: 48px;

  ${({ theme }) => theme.mediaQueries.nav} {
    border-radius: 50px;
    margin: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 1rem;
    height: 75px;
  }
`

const WalletMobi = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const BodyWrapper = styled(Box)`
  position: relative;
  width: 100%;
  /* min-height: 100vh; */

  /* ${({ theme }) => theme.mediaQueries.md} {
    width: calc(100% - ${({ theme }) => theme.mainValues.asideWidth}px);
    margin-left: ${({ theme }) => theme.mainValues.asideWidth}px;
  } */
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`

const PositionFunnyBg = styled.div`
  position: absolute;

  &.funny-1 {
    top: 10vw;
    left: 12vw;
  }

  &.funny-2 {
    top: 5vw;
    right: 6vw;
  }

  &.funny-3 {
    bottom: 1vw;
    left: 1vw;
  }

  &.funny-4 {
    bottom: 1vw;
    left: 50%;
    transform: translateX(-50%);
  }

  &.funny-5 {
    bottom: 0vw;
    right: 1vw;
  }
`

const SocialBg = styled(Flex).attrs({ width: [36, , , , 46], height: [36, , , , 46] })`
  background: rgba(115, 136, 142, 1);
  border-radius: 50%;

  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
`

const MobileMenuList = styled.div`
  position: absolute;
  /* padding: 10px 0; */
  border: 1px solid white;
  top: 45px;
  right: 0px;
  z-index: 99;

  height: auto;
  opacity: 1;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.BlackColor};
  transition: opacity 0.25s linear;

  width: 110px;
  max-width: 175px;
`

const DesktopMenuItems = styled(Flex)`
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
`

const Menu: React.FC<NavProps> = ({
  linkComponent = 'a',
  userMenu,
  banner,
  header,
  globalMenu,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  children,
}) => {
  const { isMobile } = useMatchBreakpoints()
  const [showMenu, setShowMenu] = useState(true)
  const refPrevOffset = useRef(typeof window === 'undefined' ? 0 : window.pageYOffset)

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT

  const totalTopMenuHeight = banner ? MENU_HEIGHT : MENU_HEIGHT

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight
      const isTopOfPage = currentOffset === 0
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true)
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true)
        } else {
          // Has scroll down
          setShowMenu(false)
        }
      }
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [totalTopMenuHeight])

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')

  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly)
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly)

  const [isOpen, setIsOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  const handleCloseMenu = () => {
    setIsOpen(false)
  }
  const hehe = useOnClickOutside(menuRef, handleCloseMenu)

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)

    // handleCloseMenu()
  }

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
        <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
          <StyledNav>
            <FlexHeader>
              <Flex flex={['0 0 auto', , , , '1']}>
                <Logo isDark={isDark} href={homeLink?.href ?? '/swap'} />
              </Flex>

              <DesktopMenuItems margin="auto" height="auto">
                {!isMobile && <MenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} />}
              </DesktopMenuItems>

              {/* {!isMobile && <MenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} />} */}

              <Flex
                flex="1"
                alignItems="center"
                justifyContent="flex-end"
                style={{ gap: isMobile ? '0.5rem' : '1rem' }}
              >
                {isMobile ? null : (
                  <Flex alignItems="center">
                    <img alt="#" src="/images/logo_noBg.png" />
                  </Flex>
                )}

                {userMenu}

                {isMobile ? (
                  <Flex position="relative" height="25px" ref={menuRef}>
                    <Button
                      width="auto"
                      padding="6px 0px"
                      fontSize={['0.875rem']}
                      height="auto"
                      onClick={handleOpenMenu}
                      style={{
                        background: 'transparent',
                        boxShadow: 'none',
                      }}
                    >
                      <MenuIcon width={12} height={10} />
                    </Button>
                    {isOpen && (
                      <MobileMenuList>
                        <MenuItems
                          flexDirection="column"
                          items={links}
                          activeItem={activeItem}
                          activeSubItem={activeSubItem}
                          handleCloseMenu={handleCloseMenu}
                        />
                      </MobileMenuList>
                    )}
                  </Flex>
                ) : null}
              </Flex>
            </FlexHeader>
            {/* <WalletMobi height="100%">
              {globalMenu}
            </WalletMobi> */}
          </StyledNav>
        </FixedContainer>
        {/* {subLinks && (
          <Flex style={{ background: 'transparent' }} justifyContent="space-around">
            <SubMenuItems items={subLinksWithoutMobile} mt={`${totalTopMenuHeight}px`} activeItem={activeSubItem} />
            {subLinksMobileOnly?.length > 0 && (
              <SubMenuItems items={subLinksMobileOnly} activeItem={activeSubItem} isMobileOnly />
            )}
          </Flex>
        )} */}
        <BodyWrapper
        // mt={!subLinks ? `${totalTopMenuHeight + 1}px` : '0'}
        >
          <Inner isPushed={false} showMenu={showMenu}>
            {/* {header} */}
            {children}
            <Footer
            // items={footerLinks}
            // isDark={isDark}
            // toggleTheme={toggleTheme}
            // langs={langs}
            // setLang={setLang}
            // currentLang={currentLang}
            // cakePriceUsd={cakePriceUsd}
            // buyCakeLabel={buyCakeLabel}
            // mb={[`${MOBILE_MENU_HEIGHT}px`, null, '0px']}
            />
          </Inner>
        </BodyWrapper>
        {/* {isMobile && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />} */}
      </Wrapper>
    </MenuContext.Provider>
  )
}

export default Menu
