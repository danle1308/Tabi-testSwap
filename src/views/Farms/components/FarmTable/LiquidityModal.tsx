import styled from 'styled-components'
import { HelpIcon, Text, Skeleton, useTooltip } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { Token } from '@tabi-dex/sdk'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface LiquidityProps {
  liquidity: BigNumber
  token: Token
  quoteToken: Token
}

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 14px;

  > ${Text} {
    font-weight: 500;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity, token, quoteToken }) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0) ? (
      `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    ) : (
      <Skeleton width={60} />
    )
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total value of the funds in this farm’s liquidity pool'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <Container>
      <LiquidityWrapper>
        <Text style={{ fontSize: '18px', color: 'white', fontWeight: '700', display: 'flex', gap: '5px' }}>
          {displayLiquidity} {token.symbol}.{quoteToken.symbol} LP
        </Text>
      </LiquidityWrapper>
    </Container>
  )
}

export default Liquidity
