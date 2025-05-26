import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import { Modal, ModalBody, Text, Button, Flex, InjectedModalProps, ModalHeader } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import orderBy from 'lodash/orderBy'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { AppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import styled from 'styled-components'
import { UIText, UIButton } from 'components/TabiSwap/components/ui'
import { AutoRow } from '../../Layout/Row'
import Transaction from './Transaction'
import ConnectWalletButton from '../../ConnectWalletButton'

function renderTransactions(transactions: TransactionDetails[]) {
  return (
    <Flex flexDirection="column">
      {transactions.map((tx) => {
        return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
      })}
    </Flex>
  )
}

const TransactionsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const StyledButtonConnect = styled(ConnectWalletButton)`
    height: 46px;
    border-radius: 8px;
  `

  const StyledModal = styled(Modal)`
    max-width: 424px;
    width: 100%;

    > ${ModalHeader} {
      background: unset !important;
    }
  `

  const { account, chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const allTransactions = useAllTransactions()

  const { t } = useTranslation()

  const sortedRecentTransactions = orderBy(
    Object.values(allTransactions).filter(isTransactionRecent),
    'addedTime',
    'desc',
  )

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <StyledModal
      bodyPadding={['12px 24px 24px']}
      title={t('Recent Transactions')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
    >
      {account ? (
        <>
          {/* <ModalBody> */}
          {!!pending.length || !!confirmed.length ? (
            <>
              <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
                <UIText.MainText>{t('Recent Transactions')}</UIText.MainText>
                <UIButton.UIModalClearAllButton variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                  {t('clear all')}
                </UIButton.UIModalClearAllButton>
              </AutoRow>
              {renderTransactions(pending)}
              {renderTransactions(confirmed)}
            </>
          ) : (
            <UIText.MainText>{t('No recent transactions')}</UIText.MainText>
          )}
          {/* </ModalBody> */}
        </>
      ) : (
        <StyledButtonConnect />
      )}
    </StyledModal>
  )
}

export default TransactionsModal
