import { HistoryIcon, Button, useModal } from 'packages/uikit'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
      <Button variant="text" p={0} height="auto" onClick={onPresentTransactionsModal} ml="0">
        <HistoryIcon color="#ffffff" width="24px" />
      </Button>
    </>
  )
}

export default Transactions
