import styled from 'styled-components'
import { Button, ButtonMenuItem } from 'packages/uikit'

// type UIButton = {}

const UIStyledButton = styled(Button)`
  border: none;
  border-radius: 25px;
  padding: 0 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 8px;

  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.MainColor};
  color: ${({ theme }) => theme.colors.BlackColor};

  > img {
    width: 24px;
    height: 24px;
  }

  .dropdown-icon {
    width: 16px;
    height: 16px;
  }
`

const UIStyledActionButton = styled(Button)`
  position: relative;
  z-index: 1;

  /* color: ${({ theme }) => theme.colors.BlackColor};/ */
  background-color: ${({ theme }) => theme.colors.MainColor};
  font-size: 16px;
  font-weight: 800;

  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 44px;
  /* width: 100%; */
  border-radius: 8px;
  border: none;
  padding: 0 16px;
`

const UIModalClearAllButton = styled(Button)`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.WhiteColor};
  opacity: 0.8;
  background: transparent;
  border: 0;
`

const TabButtonMenuItem = styled(ButtonMenuItem)`
  border-radius: 8px;
  background-color: ${({ theme, isActive }) => (isActive ? `${theme.colors.MainColor}` : `${theme.colors.BlackColor}`)};
  color: ${({ theme, isActive }) => (isActive ? `${theme.colors.BlackColor}` : `${theme.colors.WhiteColor}`)};
  font-weight: 700 !important;

  :hover {
    color: ${({ theme }) => theme.colors.WhiteColor};
  }
`

export { UIStyledButton, UIStyledActionButton, UIModalClearAllButton, TabButtonMenuItem }
