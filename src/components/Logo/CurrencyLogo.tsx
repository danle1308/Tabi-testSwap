import { Currency, ETHER, Token } from '@tabi-dex/sdk'
import { Box, VelasIcon } from 'packages/uikit'
import { useMemo } from 'react'
import styled from 'styled-components'
import { WrappedTokenInfo } from 'state/types'
import useHttpLocations from '../../hooks/useHttpLocations'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    // return <VelasIcon width={size} style={style} />
    return (
      <Box width={size} height={size} borderRadius="50%" overflow="hidden" style={style}>
        <img src="/images/tokens/native.png" alt="logo-native" />
      </Box>
    )
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
