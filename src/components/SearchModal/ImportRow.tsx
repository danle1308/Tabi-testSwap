import { CSSProperties } from 'react'
import { Token } from '@tabi-dex/sdk'
import { Button, Text, CheckmarkCircleIcon, useMatchBreakpoints } from 'packages/uikit'
import Row, { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import styled from 'styled-components'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { useTranslation } from 'contexts/Localization'
import { useAddUserToken } from 'state/user/hooks'

const TokenSection = styled(RowBetween)<{ dim?: boolean }>`
  padding: 4px 10px;
  height: 56px;
  align-items: center;
  border-radius: 10px;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};

  background: transparent;

  /* ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
  } */

  :hover {
    transition: 100ms;
    background: var(--color-hover-menuitems);
  }
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  height: 12px;
  width: 12px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};

  ${({ theme }) => theme.mediaQueries.md} {
    height: 16px;
    width: 16px;
  }
`

const NameOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70px;
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
    max-width: 140px;
  }
`

const RestyledButton = styled(Button)`
  width: 100px;
  height: 22px;
  border-radius: 5px;
  box-shadow: none;
  font-size: 12px;
  font-weight: 400;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 27px;
    width: 113px;
    font-size: 14px;
  }
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // globals
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const { t } = useTranslation()

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList()
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list

  console.log('inactiveTokenList', inactiveTokenList)

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  const addToken = useAddUserToken()

  return (
    <TokenSection>
      <Row style={{ gap: '0.5rem' }}>
        <CurrencyLogo currency={token} size={isMobile ? '20px' : '30px'} style={{ opacity: dim ? '0.6' : '1' }} />
        <AutoColumn style={{ opacity: dim ? '0.6' : '1' }}>
          <AutoColumn>
            <Text fontSize={['12px', , , , '16px']} fontWeight="500" mr="0px">
              {token.symbol}
            </Text>
            <Text fontWeight="500" color="var(--color-text-second)">
              <NameOverflow title={token.name}>{token.name}</NameOverflow>
            </Text>
          </AutoColumn>
        </AutoColumn>
      </Row>
      {!isActive && !isAdded ? (
        <RestyledButton
          scale={isMobile ? 'sm' : 'md'}
          onClick={() => {
            addToken(token)
            // if (setImportToken) {
            //   setImportToken(token)
            // }
            // showImportView()
          }}
        >
          {t('Import')}
        </RestyledButton>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text fontSize={isMobile ? '10px' : '12px'} color="success">
            Active
          </Text>
        </RowFixed>
      )}
    </TokenSection>
  )
}
