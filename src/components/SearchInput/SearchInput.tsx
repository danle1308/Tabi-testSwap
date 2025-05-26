import { useState, useMemo } from 'react'
import { Input, SearchIcon } from 'packages/uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
  margin-left: auto;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textScroll};
  border: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textScroll};
  }
`

const InputWrapper = styled.div`
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }

  svg {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    color: #999999;
  }
`

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search', ...props }) => {
  const [searchText, setSearchText] = useState('')

  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <InputWrapper>
      <StyledInput value={searchText} onChange={onChange} placeholder={t(placeholder)} {...props} />
      <SearchIcon color="#999999" />
    </InputWrapper>
  )
}

export default SearchInput
