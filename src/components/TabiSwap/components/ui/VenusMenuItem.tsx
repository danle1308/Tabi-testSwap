import MenuItem from 'packages/uikit/src/components/MenuItem'
import { Link } from 'packages/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled, { css } from 'styled-components'

const VenusStyledMenuItem = styled(MenuItem)`
  padding: 12px 24px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 5px;

    width: 14px;
    height: 10px;
    opacity: 0;
    background: url('/images/svgs/link-active.svg');

    ${(props) =>
      props.isActive &&
      css`
        opacity: 1;
      `}
  }
`

const VenusStyledMenuLink = styled(Link)`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  grid-gap: 0.8em;

  color: ${({ theme }) => theme.colors.BlackColor};
  font-weight: 700;
  margin-bottom: 0;

  &:hover {
    text-decoration: none;
  }
`

export const VenusMenuItem: React.FC = ({ children, isActive, href, ...props }: any) => {
  return (
    <NextLinkFromReactRouter to={href} {...props} prefetch={false}>
      <VenusStyledMenuItem isActive={isActive}>
        <VenusStyledMenuLink>{children}</VenusStyledMenuLink>
      </VenusStyledMenuItem>
    </NextLinkFromReactRouter>
  )
}
