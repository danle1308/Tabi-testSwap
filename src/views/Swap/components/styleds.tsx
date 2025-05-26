import { ErrorIcon, Flex, Text } from 'packages/uikit'
import { AutoColumn } from 'components/Layout/Column'
import styled, { css } from 'styled-components'
import { RowBetween } from 'components/Layout/Row'

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 0.5rem;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 5px 30px 36px 30px;
  }
`

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.colors.failure
      : severity === 2
      ? theme.colors.warning
      : severity === 1
      ? theme.colors.text
      : theme.colors.success};
`

export const StyledBalanceMaxMini = styled.button`
  height: 8px;
  width: 8px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
  margin-bottom: 3px;
  /* transform: rotate(90deg) rotateY(180deg) rotateX(0deg); */

  :hover {
    background-color: #000000;
  }
  :focus {
    background-color: #000000;
    outline: none;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 22px;
    width: 22px;
    margin-bottom: 0px;
  }
`

export const TruncatedText = styled(Text).attrs({ ellipsis: true })`
  width: auto;
  /* color: #9b9c9f; */

  ${({ theme }) => theme.mediaQueries.md} {
    width: 220px;
  }
`

const SwapCallbackErrorInner = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure}33`};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.colors.failure};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure}33`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function SwapCallbackError({ error }: { error: string }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <ErrorIcon width="24px" />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  )
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  /* background-color: ${({ theme }) => `${theme.colors.warning}33`}; */
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`

export const TradeTextColor = styled(Text).attrs({ fontSize: [10, , , , 14] })`
  color: ${({ theme }) => theme.colors.textBlur};
`

export const InputFromToSwap = styled(RowBetween)`
  background-color: ${({ theme }) => theme.colors.BlackColor};
  /* padding: 10px 12px; */
  border-radius: 8px;
`

export const InformationText = styled(Text).attrs({ fontSize: [10, , , , 14] })`
  color: ${({ theme }) => theme.colors.textBlur};
`
