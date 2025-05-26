import { ChainId, Currency, currencyEquals, ETHER, Token } from '@tabi-dex/sdk'
import { Text, useMatchBreakpoints } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

import { UIText } from 'components/TabiSwap/components/ui'
import { SUGGESTED_BASES } from '../../config/constants'
import { AutoColumn } from '../Layout/Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'

// const BaseWrapper = styled.div<{ disable?: boolean }>`
//   /* border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.dropdown)}; */
//   border-radius: 20px;
//   height: 28px;
//   display: flex;
//   /* justify-content: center; */
//   padding: 0px 0px 0px 5px;
//   background: ${({ theme }) => theme.colors.InputBg};
//   width: 100%;

//   align-items: center;
//   :hover {
//     cursor: ${({ disable }) => !disable && 'pointer'};
//     background-color: ${({ theme, disable }) => !disable && theme.colors.background};
//   }

//   background-color: ${({ theme, disable }) => disable && theme.colors.InputBg};
//   opacity: ${({ disable }) => disable && '0.4'};
// `

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border-radius: 20px;
  height: 23px;
  display: flex;
  padding: 0px 5px;
  background: ${({ theme }) => theme.colors.InputBg};
  width: 57px;
  align-items: center;

  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    /* background-color: ${({ theme, disable }) => !disable && theme.colors.background}; */
    background-color: var(--color-hover-button);
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.InputBg};
  opacity: ${({ disable }) => disable && '0.4'};
  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 28px;
    width: 87px;
  }
`

const BaseText = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 12px;
  max-width: 43px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
    max-width: 53px;
  }
`

const BaseList = styled.div`
  display: grid;
  /* grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); */
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  width: 100%;
  row-gap: 8px;
  column-gap: 6px;
  margin-top: 0.5rem;
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <AutoColumn gap={isMobile ? 'xs' : 'md'}>
      {/* <AutoRow>
        <UIText.MainText fontSize="14px">{t('Common bases')}</UIText.MainText>
        <QuestionHelper text={t('These tokens are commonly paired with other tokens.')} ml="4px" />
      </AutoRow> */}
      <BaseList>
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo size={isMobile ? '15px' : '20px'} currency={ETHER} style={{ marginRight: 4 }} />
          <BaseText>{ETHER.symbol}</BaseText>
        </BaseWrapper>

        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8, borderRadius: '50%' }} />
              <BaseText>{token.symbol}</BaseText>
            </BaseWrapper>
          )
        })}
      </BaseList>
    </AutoColumn>
  )
}
