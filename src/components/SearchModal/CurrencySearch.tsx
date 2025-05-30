/* eslint-disable no-restricted-syntax */
import { KeyboardEvent, RefObject, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { Currency, ETHER, Token } from '@tabi-dex/sdk'
import { Text, Input, Box, SearchIcon, useMatchBreakpoints } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { FixedSizeList } from 'react-window'
import { useAudioModeManager } from 'state/user/hooks'
import useDebounce from 'hooks/useDebounce'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllLists, useInactiveListUrls } from 'state/lists/hooks'
import { TagInfo, WrappedTokenInfo } from 'state/types'
import styled from 'styled-components'
import { useAllTokens, useToken, useIsUserAddedToken } from '../../hooks/Tokens'
import { isAddress } from '../../utils'
import Column, { AutoColumn } from '../Layout/Column'
import Row from '../Layout/Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { useSortedTokensByQuery, createFilterToken } from './filtering'
import useTokenComparator from './sorting'
import { getSwapSound } from './swapSound'

import ImportRow from './ImportRow'

interface CurrencySearchProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}

function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): WrappedTokenInfo[] {
  const lists = useAllLists()
  const inactiveUrls = useInactiveListUrls()
  const { chainId } = useActiveWeb3React()
  const activeTokens = useAllTokens()
  return useMemo(() => {
    if (!search || search.trim().length === 0) return []
    const filterToken = createFilterToken(search)
    const exactMatches: WrappedTokenInfo[] = []
    const rest: WrappedTokenInfo[] = []
    const addressSet: { [address: string]: true } = {}
    for (const url of inactiveUrls) {
      const list = lists[url].current
      // eslint-disable-next-line no-continue
      if (!list) continue
      for (const tokenInfo of list.tokens) {
        if (
          tokenInfo.chainId === chainId &&
          !(tokenInfo.address in activeTokens) &&
          !addressSet[tokenInfo.address] &&
          filterToken(tokenInfo)
        ) {
          const tags: TagInfo[] =
            tokenInfo.tags
              ?.map((tagId) => {
                if (!list.tags?.[tagId]) return undefined
                return { ...list.tags[tagId], id: tagId }
              })
              ?.filter((x): x is TagInfo => Boolean(x)) ?? []
          const wrapped: WrappedTokenInfo = new WrappedTokenInfo(tokenInfo, tags)
          addressSet[wrapped.address] = true
          const trimmedSearchQuery = search.toLowerCase().trim()
          if (
            tokenInfo.name?.toLowerCase() === trimmedSearchQuery ||
            tokenInfo.symbol?.toLowerCase() === trimmedSearchQuery
          ) {
            exactMatches.push(wrapped)
          } else {
            rest.push(wrapped)
          }
        }
      }
    }
    return [...exactMatches, ...rest].slice(0, minResults)
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search])
}

function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showImportView,
  setImportToken,
}: CurrencySearchProps) {
  const SearchIconInput = styled.div`
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translate(-50%, -50%);
  `

  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const [audioPlay] = useAudioModeManager()

  const showBNB: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'b' || s === 'bn' || s === 'eth'
  }, [debouncedQuery])

  const filteredTokens: Token[] = useMemo(() => {
    const filterToken = createFilterToken(debouncedQuery)
    return Object.values(allTokens).filter(filterToken)
  }, [allTokens, debouncedQuery])

  const filteredQueryTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredSortedTokens: Token[] = useMemo(() => {
    return [...filteredQueryTokens].sort(tokenComparator)
  }, [filteredQueryTokens, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      if (audioPlay) {
        getSwapSound().play()
      }
    },
    [audioPlay, onCurrencySelect],
  )

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
  )

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(debouncedQuery)

  const hasFilteredInactiveTokens = Boolean(filteredInactiveTokens?.length)

  const getCurrencyListRows = useCallback(() => {
    if (searchToken && !searchTokenIsAdded && !hasFilteredInactiveTokens) {
      return (
        <Column style={{ padding: isMobile ? '0' : '15px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      )
    }

    return Boolean(filteredSortedTokens?.length) || hasFilteredInactiveTokens ? (
      <Box margin={isMobile ? '0px -10px 0px -3px' : '10px -10px 0px -3px'}>
        <CurrencyList
          height={isMobile ? 300 : 390}
          showBNB={showBNB}
          currencies={filteredSortedTokens}
          inactiveCurrencies={filteredInactiveTokens}
          breakIndex={
            Boolean(filteredInactiveTokens?.length) && filteredSortedTokens ? filteredSortedTokens.length : undefined
          }
          onCurrencySelect={handleCurrencySelect}
          otherCurrency={otherSelectedCurrency}
          selectedCurrency={selectedCurrency}
          fixedListRef={fixedList}
          showImportView={showImportView}
          setImportToken={setImportToken}
        />
      </Box>
    ) : (
      <Column style={{ padding: '20px', height: '100%' }}>
        <Text color="textSubtle" textAlign="center" mb="20px">
          {t('No results found.')}
        </Text>
      </Column>
    )
  }, [
    filteredInactiveTokens,
    filteredSortedTokens,
    handleCurrencySelect,
    hasFilteredInactiveTokens,
    otherSelectedCurrency,
    searchToken,
    searchTokenIsAdded,
    selectedCurrency,
    setImportToken,
    showBNB,
    showImportView,
    t,
  ])

  return (
    <>
      <AutoColumn gap={isMobile ? '5px' : '16px'}>
        <Row style={{ position: 'relative' }}>
          {/* <SearchIconInput>
            <SearchIcon style={{ fill: '#999999' }} />
          </SearchIconInput> */}
          <SearchCurrencyInput
            id="token-search-input"
            placeholder={t('Search name or paste address...')}
            scale="lg"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
        {showCommonBases && !searchQuery ? (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        ) : null}
      </AutoColumn>
      {getCurrencyListRows()}
    </>
  )
}

export default CurrencySearch

const SearchCurrencyInput = styled(Input)`
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.InputBg};
  color: #9b9c9f;
  border: 0.5px solid var(--color-grey-border-input);

  ::placeholder {
    color: #9b9c9f;
    font-weight: 200;
    font-size: 10px;
  }

  height: 30px;
  font-size: 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 48px;
    font-size: 14px;

    ::placeholder {
      font-size: 14px;
    }
  }
`
