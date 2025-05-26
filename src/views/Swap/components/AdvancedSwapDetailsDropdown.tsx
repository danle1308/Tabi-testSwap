import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '10px' : 0)};
  padding-top: 4px;
  padding-bottom: 4px;
  width: 100%;
  /* max-width: 400px; */
  /* background-color: ${({ theme }) => theme.colors.InvertedContrastColor}; */
  z-index: 2;
  position: relative;
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  /* border: 5px solid #2d5000; */
  border-radius: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 16px;
    padding-bottom: 16px;
  }
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
