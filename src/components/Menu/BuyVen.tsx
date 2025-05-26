import styled from 'styled-components'
import { UIButton } from 'components/TabiSwap/components/ui'
import Link from 'next/link'

export const BuyVen = () => {
  return (
    <BuyVenSection>
      <Link passHref href="/swap">
        <UIButton.UIStyledActionButton as="a">Buy VEN</UIButton.UIStyledActionButton>
      </Link>
    </BuyVenSection>
  )
}

const BuyVenSection = styled.div`
  position: relative;
  height: ${({ theme }) => `${theme.mainValues.footerHeight}px`};
  background-color: rgba(13, 13, 15, 0.8);
  margin-top: auto;
  padding: 12px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  &::after {
    content: '';
    position: absolute;

    background-size: contain;
    width: 141.41px;
    height: 141.41px;

    bottom: 0;
    right: 0;
    transform: translate(25px, 50%);
  }

  .footer-top {
    display: flex;
    align-items: center;
    grid-gap: 8px;
    color: ${({ theme }) => `${theme.colors.WhiteColor}`};
  }
`
