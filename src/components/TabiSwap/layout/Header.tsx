/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'packages/uikit/src/hooks'
import { Flex, Button, Text } from 'packages/uikit'
import MenuItems from 'packages/uikit/src/components/MenuItems'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { FlexGap } from 'components/Layout/Flex'
import { useRouter } from 'next/router'
import { MainContainer } from './styles'
import UserMenu from '../../Menu/UserMenu'
import { UIButton } from '../components/ui'

type SelectItemProps = {
  icon?: null | unknown | string | ReactElement | boolean
  color?: string
  label?: string
}

const SelectChainItem: FC<SelectItemProps> = ({ icon, color, label }) => {
  const { isMobile } = useMatchBreakpoints()
  const valueTextMb = isMobile ? label.substring(0, 4) : label

  return <></>
}

export const Header = ({ mobileList, activeItem }) => {
  const { isMobile } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)
  const [option, setOption] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  const handleOpenMenu = () => setIsOpen((prev) => !prev)

  const handleOptionChange = (opt: OptionProps): void => {
    setOption(opt.value)
  }

  return (
    <MainHeader>
      <MainContainer>
        <Flex>
          {isMobile ? (
            <MenuMobile>
              <FlexGap gap="8px">
                <Button className="menu-button" onClick={handleOpenMenu}>
                  <img src="/images/svgs/hambuger.svg" alt="mb-menu" />
                </Button>
              </FlexGap>

              <MenuList isOpen={isOpen}>
                <MenuMobileList flexDirection="column" items={mobileList} activeItem={activeItem} />
              </MenuList>
            </MenuMobile>
          ) : null}

          <HeaderButtons>
            <UserMenu />
          </HeaderButtons>
        </Flex>
      </MainContainer>
    </MainHeader>
  )
}

const MainHeader = styled.header`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.BlackColor};
  width: 100%;
  min-height: auto;
  padding: 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    background-color: ${({ theme }) => theme.colors.TopBottomColor};
    min-height: 80px;
  }
`

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  grid-gap: 12px;
  width: fit-content;
`

const DropdownButton = styled(UIButton.UIStyledButton)`
  font-size: clamp(10px, 2vw, 16px);
  color: ${({ theme }) => theme.colors.WhiteColor};
  background: #1a1e21;
  min-height: 29px !important;
  max-height: 29px;

  .dropdown-icon {
    width: 16px;
    height: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 100%;
  }
`

const MenuMobile = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;

  .menu-button,
  .menu-logo {
    background-color: transparent;
    padding: 0;

    img {
      height: 24px;
    }
  }

  .menu-button {
    img {
      transform: rotate(180deg);
    }
  }
`

const MenuMobileList = styled(MenuItems)`
  white-space: nowrap;
`

const MenuList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  padding: 10px 0;
  top: 65px;
  left: 0;
  z-index: ${({ isOpen }) => (isOpen ? 99 : -1)};

  height: auto;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.BlackColor};
  transition: opacity 0.25s linear;
`
