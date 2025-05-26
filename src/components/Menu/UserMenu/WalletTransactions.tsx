import { useDispatch } from 'react-redux'
import { Box, Button, Flex, Text, useMatchBreakpoints, WalletIcon } from 'packages/uikit'
import { AppDispatch } from 'state'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { clearAllTransactions } from 'state/transactions/actions'
import orderBy from 'lodash/orderBy'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import TransactionRow from './TransactionRow'

const RestyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const RestyledFlex = styled(Flex)`
  position: absolute;
  bottom: 14px;
  right: 28vw;

  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 20px;
    right: 7.3vw;
  }
`

const WalletTransactions: React.FC<{ isClear: any; setIsClear: any }> = ({ isClear, setIsClear }) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const allTransactions = useAllTransactions()
  const sortedTransactions = orderBy(Object.values(allTransactions).filter(isTransactionRecent), 'addedTime', 'desc')

  // const handleClearAll = () => {
  //   if (chainId && isClear) {
  //     dispatch(clearAllTransactions({ chainId }))
  //   }
  // }

  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    if (chainId && isClear === true) {
      dispatch(clearAllTransactions({ chainId }))
      setIsClear(false)
    }
    return setIsClear(false)
  }, [chainId, isClear])

  return (
    <>
      <RestyledBox>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((txn) => <TransactionRow key={txn.hash} txn={txn} />)
        ) : (
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Flex
              justifyContent="center"
              alignItems="center"
              width={[22, , , , 30]}
              height={[22, , , , 30]}
              border="1px solid var(--color-white)"
              borderRadius="50%"
            >
              <WalletIcon width={isMobile ? '12px' : '16px'} />
            </Flex>
            <Text fontSize={['10px', , , , '14px']} textAlign="center">
              {t('No Transactions yet')}
            </Text>
          </Flex>
        )}
      </RestyledBox>
      {/* <RestyledFlex alignItems="center" justifyContent="center">
        {sortedTransactions.length > 0 && (
          <Button
            scale="xs"
            onClick={handleClearAll}
            variant="text"
            px="0"
            style={{ color: 'var(--color-red)', fontSize: isMobile ? '10px' : '14px', fontWeight: '700' }}
          >
            {t('Clear All')}
          </Button>
        )}
      </RestyledFlex> */}
    </>
  )
}

export default WalletTransactions
