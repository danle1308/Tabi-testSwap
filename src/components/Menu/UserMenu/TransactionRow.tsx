import {
  BlockIcon,
  Button,
  CheckmarkCircleIcon,
  Flex,
  Link,
  NewLinkIcon,
  OpenNewIcon,
  RefreshIcon,
  Text,
  useMatchBreakpoints,
} from 'packages/uikit'
import styled from 'styled-components'
import { TransactionDetails } from 'state/transactions/reducer'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'

interface TransactionRowProps {
  txn: TransactionDetails
}

const TxnIcon = styled(Flex)`
  align-items: center;
  justify-content: center;

  width: 15px;
  aspect-ratio: 1/1;
  height: auto;

  border-radius: 50%;
  background: #d9d9d9;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 20px;
  }
`

// const Summary = styled.div`
//   flex: 1;
//   padding: 0 8px;
//   color: ${({ theme }) => theme.colors.WhiteColor};
//   font-size: 14px;
//   font-weight: 700;
// `

const TxnLink = styled(Link)`
  align-items: center;
  color: #000000;
  display: flex;

  &:hover {
    text-decoration: none;
  }
`

const Wrapper = styled(Flex).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#FFFFFF33',
  borderRadius: '30px',
  padding: ['0 0.4rem 0 0.6rem'],
  width: '100%',
  height: '100%',
})`
  padding: 0 0.4rem 0 0.6rem;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 0.6rem 0 1rem;
  }
`

const ButtonView = styled(Button).attrs({
  variant: 'text',
  padding: '0',
  fontSize: [14],
  width: '100%',
})`
  height: 28px;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 40px;
  }
`

const StyledText = styled(Text)`
  max-width: 160px;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 12px;
    max-width: 240px;
  }
`

const renderIcon = (txn: TransactionDetails) => {
  if (!txn.receipt) {
    return <RefreshIcon spin width="24px" />
  }

  return txn.receipt?.status === 1 || typeof txn.receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="24px" />
  ) : (
    <BlockIcon color="failure" width="24px" />
  )
}

const TransactionRow: React.FC<TransactionRowProps> = ({ txn }) => {
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()

  if (!txn) {
    return null
  }

  return (
    <>
      <ButtonView>
        <Wrapper>
          <Flex alignItems="center">
            <StyledText>{txn.summary ?? txn.hash}</StyledText>
          </Flex>
          <TxnLink href={getBscScanLink(txn.hash, 'transaction', chainId)} external>
            <TxnIcon>
              <NewLinkIcon width={isMobile ? '7px' : '10px'} />
            </TxnIcon>
          </TxnLink>
        </Wrapper>
      </ButtonView>
    </>
  )
}

export default TransactionRow
