import { useCallback } from 'react'
import styled from 'styled-components'
import { Text, Link, useMatchBreakpoints } from 'packages/uikit'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { AutoColumn } from '../../../components/Layout/Column'
import { RowBetween } from '../../../components/Layout/Row'
import { getBscScanLink } from '../../../utils'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
  width: 100%;
`

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #2d5000;
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

const InputContainer = styled.div`
  flex: 1;
  padding: 0.5rem 1rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 1rem;
  }
`

const Input = styled.input<{ error?: boolean }>`
  font-size: 14px;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
    font-size: 14px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;

    ::placeholder {
      font-size: 18px;
    }
  }
`

export default function AddressInputPanel({
  id,
  value,
  onChange,
}: {
  id?: string
  // the typed string value
  value: string
  // triggers whenever the typed value changes
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const address = isAddress(value) ? value : undefined

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange],
  )

  const error = Boolean(value.length > 0 && !address)

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap={isMobile ? 'sm' : 'md'}>
            <RowBetween>
              <Text color="black">{t('Recipient')}</Text>
              {address && chainId && (
                <Link
                  external
                  style={{ fontSize: isMobile ? '10px' : '14px' }}
                  href={getBscScanLink(address, 'address', chainId)}
                >
                  ({t('View on Explorer')})
                </Link>
              )}
            </RowBetween>
            <Input
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={t('Wallet Address')}
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  )
}
